import React, { useState } from "react";
import "./component.css";
const APIURL = "https://api.github.com/users/";
function GitHubProfile() {
  const [searchValue, setSearchValue] = useState("");
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [error, setError] = useState(null);
  const getUser = async (username) => {
    try {
      const response = await fetch(APIURL + username);
      if (response.ok) {
        const userData = await response.json();
        console.log(userData);
        setUser(userData);
        getRepos(username);
      } else {
        throw new Error("No profile with this username");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const getRepos = async (username) => {
    try {
      const response = await fetch(APIURL + username + "/repos?sort=created");
      if (response.ok) {
        const reposData = await response.json();
        setRepos(reposData);
      } else {
        throw new Error("Problem fetching repos");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchValue) {
      getUser(searchValue);
      setSearchValue("");
    }
  };

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  const renderUserCard = () => {
    if (user) {
      const userID = user.name || user.login;
      const userBio = user.bio ? <p>{user.bio}</p> : "";
      return (
        <div className="divCard flex gap-x-10">
          <div>
            <img
              src={user.avatar_url}
              alt={user.name}
              className="w-155 rounded-full border-4 border-purple-900"
              style={{ maxWidth: "150px", height: "150px" }}
            />
          </div>
          <div className="user-info flex flex-col gap-y-4">
            <h2 className="text-2xl font-bold">{userID}</h2>
            {userBio}
            <div className="flex">
              <ul className="flex flex-row">
                <li className="flex items-center mr-5">
                  {user.followers} <strong className="mx-2">Followers</strong>
                </li>
                <li className="flex items-center mr-5">
                  {user.following} <strong className="mx-2">Following</strong>
                </li>
                <li className="flex items-center">
                  {user.public_repos} <strong className="mx-2">Repos</strong>
                </li>
              </ul>
            </div>
            <div id="repos" className="flex flex-wrap">
              {renderRepos()}
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderRepos = () => {
    return repos.map((repo) => (
      <a
        key={repo.id}
        className="repo"
        href={repo.html_url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {repo.name}
      </a>
    ));
  };
  const renderErrorCard = () => {
    if (error) {
      return (
        <div className="card text-white">
          <img src="https://media.licdn.com/dms/image/C4D12AQF1DVZg4wMt1w/article-cover_image-shrink_600_2000/0/1520112491771?e=2147483647&v=beta&t=3VqzjMtGFalxIckYg-3SR4Aa7hBPc0j_SBlot4Y1oOY" alt="" style={{width:"500px"}}/>
        </div>
      );
    }
    return null;
  };
  return (
    <div
      className="container  h-screen flex items-center justify-center "
      style={{ backgroundColor: "#2323d8" }}
    >
      <div className="flex flex-col items-center justify-center">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              className=" border-none outline-0 border-rounded w-full  px-3 text-white "
              style={{
                backgroundColor: "#7634e1",
                padding: "1rem",
                borderRadius: "10px",
                boxShadow:
                  "0 5px 10px rgba(154, 160, 185, 0.05), 0 15px 40px rgba(0, 0, 0, 0.1)",
                fontFamily: "inherit",
                width: "700px",
              }}
              type="text"
              placeholder="Search a Github User"
              value={searchValue}
              onChange={handleInputChange}
            />
          </div>
        </form>
        {error ? ( // Conditionally render error message or user card
          <div className="card">
            {renderErrorCard()}
          </div>
        ) : (
          <div>
            {renderUserCard()} {/* Render user card if there's no error */}
          </div>
        )}
      </div>
    </div>
  );
}
export default GitHubProfile;
