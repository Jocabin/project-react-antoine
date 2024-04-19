import { useState } from "react";
import { gh_fetch } from "./utils";
import UserEntry from "./components/UserEntry";
import RepoEntry from "./components/RepoEntry";
import Button from "./components/Button";
import ak from "./assets/ak.png";
import "./App.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserRepos, setCurrentUserRepos] = useState([]);
  const [loading, setLoading] = useState(false);

  async function searchUsers(query) {
    setLoading(true);
    const users = await gh_fetch("/search/users?q=" + query);
    setLoading(false);

    setTotalUsers(users.total_count);
    setSearchResults(users.items);
  }

  async function selectUser(username) {
    if (currentUser && username === currentUser.login) {
      setCurrentUser(null);
      setCurrentUserRepos(null);
      return;
    }

    setLoading(true);

    const user = await gh_fetch("/users/" + username);
    const repos = await gh_fetch("/users/" + username + "/repos");

    setCurrentUser(user);
    setCurrentUserRepos(repos);
    setLoading(false);
  }

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-background/90 flex justify-center items-center w-full p-4 border-b border-border/40">
        <div className="flex flex-row justify-center items-center gap-4">
          <input
            onKeyDown={(e) => {
              if (e.code === "Enter") {
                searchUsers(query);
              }
            }}
            className="min-w-[400px] flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button
            onClick={() => {
              searchUsers(query);
            }}
          >
            Chercher
          </Button>
        </div>
      </header>

      <div className="w-full h-full flex-1 flex flex-row justify-start items-stretch">
        <aside className="w-fit flex flex-col justify-start items-start border-r border-border/40 min-w-[300px]">
          <p className="px-4 py-2 text-sm border-b w-full border-border/40">
            Nombre de résultats: {totalUsers}
          </p>
          <ul className="w-full">
            {searchResults.map((el) => (
              <UserEntry
                key={el.node_id}
                user={el}
                current={currentUser}
                selectUser={() => {
                  selectUser(el.login);
                }}
              />
            ))}
          </ul>
        </aside>

        {loading && (
          <div className="flex flex-col gap-4 justify-center items-center w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid"
              width="64"
              height="64"
              className="infiniteRotate"
            >
              <g data-idx="1">
                <circle
                  cx="50"
                  cy="50"
                  fill="none"
                  stroke="#000000"
                  stroke-width="10"
                  r="35"
                  stroke-dasharray="164.93361431346415 56.97787143782138"
                  data-idx="2"
                  transform="matrix(0.6845425534240654,0.7289729024810596,-0.7289729024810596,0.6845425534240654,52.22151745284971,-20.67577279525625)"
                ></circle>
                <g data-idx="4"></g>
              </g>
            </svg>
            <p className="text-3xl">Chargement</p>
          </div>
        )}

        {!currentUser && !loading && (
          <div className="flex flex-col gap-4 justify-center items-center w-full">
            <img src={ak} alt="" />
            <p className="text-3xl">Pas d'utilisateur sélectionné</p>
          </div>
        )}

        {currentUser && !loading && (
          <div className="p-8 w-full">
            <div className="flex flex-row justify-between">
              <div>
                <p className="font-bold text-3xl">{currentUser.name}</p>
                <p className="font-bold text-xl text-muted-foreground">
                  {currentUser.login}
                </p>
                <p className="my-8">{currentUser.bio}</p>
                <p>
                  <span className="font-bold">Followers:</span>&nbsp;
                  {currentUser.followers}
                </p>
                <p>
                  <span className="font-bold">Following:</span>&nbsp;
                  {currentUser.following}
                </p>
                {currentUser.blog && (
                  <p>
                    <span className="font-bold">Blog:</span>&nbsp;
                    <a
                      className="underline text-blue-700"
                      href={currentUser.blog}
                    >
                      {currentUser.blog}
                    </a>
                  </p>
                )}
              </div>

              <a href={"https://github.com/" + currentUser.login}>
                <img
                  className="rounded-full overflow-hidden w-64"
                  src={currentUser.avatar_url}
                  alt="avatar"
                />
              </a>
            </div>

            <section className="mt-8">
              <h2 className="font-bold text-xl">
                Repositories ({currentUser.public_repos})
              </h2>

              <ul>
                {currentUserRepos.map((el) => (
                  <RepoEntry key={el.node_id} repo={el} />
                ))}
              </ul>
            </section>
          </div>
        )}
      </div>
    </>
  );
}
