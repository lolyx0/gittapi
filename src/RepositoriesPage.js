import {
  AppBar,
  Card,
  IconButton,
  Toolbar,
  styled,
  CardContent,
  CardHeader,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { common } from "@mui/material/colors";

const RepoCard = styled(Card)(() => ({
  width: "400px",
  height: "590px",
  backgroundColor: " #3e5258b9",
  color: "white",
  overflowX: "scroll",
  overflowY: "scroll",

  "&::-webkit-scrollbar": {
    scrollbarWidth: "none",
  },
  "&::-webkit-scrollbar-track": {
    boxShadow: "inset 0 0 4px #141d2f",
    webkitBoxShadow: "inset 0 0 #141d2f",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: " --theme-primary-background-color",
    outline: "1px solid #422e68",
  },
}));

const FileCard = styled(CardContent)(() => ({
  backgroundColor: " black",
  color: " #51a85c",
  width: "60%",
  height: "550px",
  overflowX: "scroll",
  overflowY: "scroll",

  "&::-webkit-scrollbar": {
    scrollbarWidth: "thin",
  },
  "&::-webkit-scrollbar-track": {
    boxShadow: "inset 0 0 2px #3e525870",
    webkitBoxShadow: "inset 0 0 #3e525870",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "--theme-secondery-background-color",
    outline: "1px solid #422e68",
  },
}));

const NavBar = styled(AppBar)(() => ({
  color: common["white"],
  backgroundColor: "#4c6a9b00",
  height: 48,
  boxShadow: "none"
}));

function RepositoriesPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const owner = params.get("owner");
  const repo = params.get("repo");
  const navigate = useNavigate();

  const Home = () => {
    navigate(`/`);
  };

  const [repoContents, setRepoContents] = useState([]);
  const [currentDirContents, setCurrentDirContents] = useState([]);
  const [fileContent, setFileContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    if (owner && repo) {
      const token = process.env.REACT_APP_API;

      fetch(`https://api.github.com/repos/${owner}/${repo}/contents`, {
        headers: {
          Authorization: `token ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setRepoContents(data);
          setCurrentDirContents(data);
          setLoading(false);
        })
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [owner, repo]);

  const handleFileClick = (file) => {
    if (file.type === "file") {
      fetch(file.download_url)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.text();
        })
        .then((content) => {
          setFileContent(content);
        })
        .catch((error) => {
          setError(error);
        });
    } else if (file.type === "dir") {
      const token = process.env.REACT_APP_API;

      fetch(file.url, {
        headers: {
          Authorization: `token ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setCurrentDirContents(data);
          setCurrentPath(file.path);
          setFileContent(null);
        })
        .catch((error) => {
          setError(error);
        });
    }
  };

  const handleBackClick = () => {
    if (currentPath) {
      const segments = currentPath.split("/");
      segments.pop();
      const newPath = segments.join("/");
      if (newPath) {
        const token = process.env.REACT_APP_API;

        fetch(
          `https://api.github.com/repos/${owner}/${repo}/contents/${newPath}`,
          {
            headers: {
              Authorization: `token ${token}`,
            },
          }
        )
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            setCurrentDirContents(data);
            setCurrentPath(newPath);
            setFileContent(null);
          })
          .catch((error) => {
            setError(error);
          });
      } else {
        setCurrentDirContents(repoContents);
        setCurrentPath("");
        setFileContent(null);
      }
    }
  };

  return (
    <>
      <div className="navbar">
        <NavBar>
          <Toolbar>
            <p
            className="back"
              aria-label="menu"
              onClick={Home}
            >
              BACK
            </p>
          </Toolbar>
        </NavBar>
      </div>
      <div className="container">
        <RepoCard variant="outlined">
          <CardHeader
            title="Repository Contents"
            titleTypographyProps={{ fontSize: "20px" }}
            action={
              currentPath && (
                <IconButton
                  size="small"
                  color="inherit"
                  onClick={handleBackClick}
                >
                  BACK
                </IconButton>
              )
            }
          />
          <CardContent>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            <ul>
              {currentDirContents.map((item) => (
                <li
                  className="data"
                  key={item.sha}
                  onClick={() => handleFileClick(item)}
                >
                  {item.type === "dir" ? (
                    <strong>Directory: </strong>
                  ) : (
                    <strong>File: </strong>
                  )}
                  {item.name}
                </li>
              ))}
            </ul>
          </CardContent>
        </RepoCard>
        <FileCard>
          <CardHeader title="File Content" />
          <CardContent>
            {fileContent ? <pre>{fileContent}</pre> : <p>Select a file</p>}
          </CardContent>
        </FileCard>
      </div>
    </>
  );
}

export default RepositoriesPage;
