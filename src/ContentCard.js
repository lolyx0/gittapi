import React, { useState } from "react";
import { Button, FormControl, Card } from "@mui/material";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import { common } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";

const SearchButton = styled(Button)(() => ({
  color: common["white"],
  borderRadius: 9,
  borderTopLeftRadius: "2",
  borderBottomLeftRadius: "2",
  backgroundColor: "#506971",
  "&:hover": {
    backgroundColor: "#506971",
  },
}));

const Input = styled(InputBase)(({ theme }) => ({
  "& .MuiInputBase-input": {
    color: common["white"],
    borderRadius: 9,
    borderTopRightRadius: "2",
    borderBottomRightRadius: "2",
    position: "relative",
    backgroundColor: "#506971",
    border: "1px solid",
    borderColor: "#506971",
    fontSize: 16,
    width: "300px",
    padding: "10px 22px",
    transition: theme.transitions.create([
      "border-color",
      "background-color",
      "box-shadow",
    ]),
    "&:focus": {
      borderColor: "var--theme-primary-color",
    },
  },
}));

const ProfileCard = styled(Card)(() => ({
  flex: "1 1 30%",
  maxWidth: "300px",
  background: "#3e525870",
  padding: "20px 30px",
  margin:"20px 20px ",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  borderRadius: "30px",
  boxShadow: "0 0 2px 0 #ccc",
  transition: "0.9s",
  color: "white",
  "&:hover": {
    transform: "scale(1.1)",
    boxShadow: "0 0 25px -5px #ccc",
  },
}));

function ContentCard() {
  const [search, setSearch] = useState("");
  const [repoData, setRepoData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!search.trim()) {
      setError({ message: "SearchBar is Empty" });
      return;
    }

    setLoading(true);
    setError(null);

    const token = process.env.REACT_APP_API;

    if (search.includes("/")) {
      const [owner, repo] = search.split("/");
      fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
          Authorization: `token ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Not Found");
          }
          return response.json();
        })
        .then((data) => {
          setRepoData([data]);
          setLoading(false);
        })
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
    } else {
      fetch(
        `https://api.github.com/search/repositories?q=${search}+in:name,description`,
        {
          headers: {
            Authorization: `token ${token}`,
          },
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Not Found");
          }
          return response.json();
        })
        .then((data) => {
          setRepoData(data.items);
          setLoading(false);
        })
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
    }
  };

  const handleViewRepo = (repoOwner, repoName) => {
    navigate(`/repositories?owner=${repoOwner}&repo=${repoName}`);
  };

  return (
    <>
      <div>

      </div>
      <div className="flex">
        <FormControl
          variant="standard"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Input
            id="search-username"
            placeholder="Enter Github username or repository "
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input"
          />
          <SearchButton
            variant="contained"
            size="large"
            className="btn"
            onClick={handleSearch}
          >
            go
          </SearchButton>
        </FormControl>
      </div>

      {loading && <p className="p">Loading...</p>}
      {error && <p className="p">{error.message}</p>}
      <div className="profile-container">
        {repoData.map((repo) => (
          <ProfileCard key={repo.id}>
            <img
              src={repo.owner.avatar_url}
              alt={`${repo.owner.login}'s avatar`}
              className="profile-icon"
            />
            <div className="profile-name">@{repo.owner.login}</div>
            <div className="profile-name">{repo.name}</div>

            <SearchButton
            class="glow-on-hover" 
              
              size="large"
              onClick={() => handleViewRepo(repo.owner.login, repo.name)}
            >
              Show Content
            </SearchButton>
          </ProfileCard>
        ))}
      </div>
    </>
  );
}

export default ContentCard;