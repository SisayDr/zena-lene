const ZenaCard = ({ zena }) => {
  return (
    <div className="relative group aspect-video w-sm bg-white rounded-lg overflow-hidden shadow-md">
      <img
        className="max-w-full group-hover:scale-115 transition-transform duration-500"
        src={zena.thumbnail}
        alt={zena.source}
      />
      <div className="absolute inset-0 bg-linear-to-t from-black to-black/10"></div>

      <div className="absolute bottom-0 p-2 text-white">
        <span className="text-sm text-gray-300">
          {new Date(zena.publishedAt).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
        <p>{zena.summary}</p>
      </div>

      <a
        className="absolute top-2 right-2 text-sm  text-white group-hover:font-bold"
        href={zena.link}
        target="_blank"
        rel="noopener noreferrer"
      >
        Read more
      </a>
    </div>
  );
};

export default ZenaCard;
