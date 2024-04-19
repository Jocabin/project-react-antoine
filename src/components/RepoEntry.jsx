export default function RepoEntry({ repo }) {
  return (
    <a
      href={repo.html_url}
      target="_blank"
      className="block p-6 border-b hover:bg-slate-100"
    >
      <p>{repo.name}</p>
    </a>
  );
}
