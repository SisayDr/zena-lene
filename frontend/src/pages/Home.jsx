import useFetch from "../contexts/useFetch";
import { useMemo, useState } from "react";
import ZenaCard from "../components/ZenaCard";

const Home = () => {
  const { data: zenaItems, loading: isLoading, error } = useFetch("/api/news");
  const [relevantOnly, setRelevantOnly] = useState(true);

  const filteredZenaItems = useMemo(() => {
    if (!zenaItems) return null;
    return relevantOnly
      ? zenaItems.filter((zena) => zena.relevanceScore !== 0)
      : zenaItems;
  }, [zenaItems, relevantOnly]);

  const TopNavBar = () => {
    return (
      <div className="fixed top-0 left-0 w-full p-4 border-b bg-gray-200 z-20">
        <div className="flex gap-2 max-w-7xl w-full m-auto">
          <h1 className="w-full text-xl font-bold">Zena Lene</h1>
          <button
            onClick={() => setRelevantOnly(false)}
            className={`${relevantOnly ? "" : "font-bold"} cursor-pointer hover:scale-105`}
          >
            All{" "}
          </button>
          <span>|</span>
          <button
            onClick={() => setRelevantOnly(true)}
            className={`${relevantOnly ? "font-bold" : ""} cursor-pointer hover:scale-105`}
          >
            Relevant
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl m-auto p-5">
      <TopNavBar />

      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-500 text-lg">Loading...</p>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-screen">
          <p className="text-red-500 text-lg">Error: {error.message}</p>
        </div>
      ) : filteredZenaItems.length === 0 ? (
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-500 text-lg">No zena items to display.</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4 items-start justify-center mt-16 md:mt-24">
          {filteredZenaItems.map((zena) => (
            <ZenaCard key={zena._id} zena={zena} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
