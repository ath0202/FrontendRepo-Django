import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Film, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Reports = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingSort, setRatingSort] = useState<"asc" | "desc" | null>(null);
  const [dateSort, setDateSort] = useState<"asc" | "desc" | null>(null);

  // Mock data with ratings
  const mockReports = [
    {
      id: 1,
      name: "Metropolis Restoration 1927",
      date: "2024-01-15",
      status: "Complete",
      framesAnalyzed: 142560,
      thumbnail: "🎬",
      rating: 9,
    },
    {
      id: 2,
      name: "Citizen Kane Analysis",
      date: "2024-01-10",
      status: "Complete",
      framesAnalyzed: 158400,
      thumbnail: "🎥",
      rating: 8,
    },
    {
      id: 3,
      name: "Casablanca Digital Transfer",
      date: "2024-01-05",
      status: "Complete",
      framesAnalyzed: 134280,
      thumbnail: "🎞️",
      rating: 7,
    },
    {
      id: 4,
      name: "The Wizard of Oz Remaster",
      date: "2023-12-28",
      status: "Complete",
      framesAnalyzed: 167920,
      thumbnail: "🌈",
      rating: 10,
    },
    {
      id: 5,
      name: "Gone with the Wind",
      date: "2023-12-20",
      status: "Complete",
      framesAnalyzed: 221760,
      thumbnail: "🔥",
      rating: 6,
    },
    {
      id: 6,
      name: "Singin' in the Rain",
      date: "2023-12-15",
      status: "Complete",
      framesAnalyzed: 145800,
      thumbnail: "☔",
      rating: 5,
    },
  ];

  // Filtered list by name
  const filteredReports = mockReports.filter((report) =>
    report.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sorting logic
  const displayedReports = [...filteredReports].sort((a, b) => {
    // If date sort is active, prioritize it over rating
    if (dateSort) {
      const da = new Date(a.date).getTime();
      const db = new Date(b.date).getTime();
      if (dateSort === "asc") return da - db;
      return db - da;
    }

    // If rating sort is active
    if (ratingSort) {
      if (ratingSort === "asc") return a.rating - b.rating || a.name.localeCompare(b.name);
      return b.rating - a.rating || a.name.localeCompare(b.name);
    }

    // Default order
    return 0;
  });

  // Helpers to toggle sort state
  const toggleSort = (sortState: "asc" | "desc" | null, setSort: any, resetOther?: any) => {
    // Reset other sort when activating this one
    if (resetOther) resetOther(null);
    if (sortState === null) setSort("asc");
    else if (sortState === "asc") setSort("desc");
    else setSort(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4 hover:bg-accent/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <Film className="w-8 h-8 text-accent" />
            <h1 className="text-4xl font-bold text-foreground">Analysis Reports</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Browse and access your past digitization reports
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 animate-fade-in">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 bg-card border-border"
            />
          </div>
        </div>

        {/* Reports Table */}
        <div className="animate-fade-in-delayed overflow-x-auto rounded-lg border border-border bg-card">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/40 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Name</th>

                {/* Sortable Date Header */}
                <th className="px-4 py-3 text-left font-medium">
                  <button
                    type="button"
                    onClick={() =>
                      toggleSort(dateSort, setDateSort, setRatingSort)
                    }
                    className="inline-flex items-center gap-1 hover:text-foreground text-muted-foreground"
                    aria-sort={
                      dateSort === "asc"
                        ? "ascending"
                        : dateSort === "desc"
                        ? "descending"
                        : "none"
                    }
                    title="Sort by date"
                  >
                    Date
                    <ArrowUpDown
                      className={`w-4 h-4 transition-opacity ${
                        dateSort ? "opacity-100" : "opacity-50"
                      }`}
                    />
                  </button>
                </th>

                <th className="px-4 py-3 text-left font-medium">Status</th>

                {/* Sortable Rating Header */}
                <th className="px-4 py-3 text-left font-medium">
                  <button
                    type="button"
                    onClick={() =>
                      toggleSort(ratingSort, setRatingSort, setDateSort)
                    }
                    className="inline-flex items-center gap-1 hover:text-foreground text-muted-foreground"
                    aria-sort={
                      ratingSort === "asc"
                        ? "ascending"
                        : ratingSort === "desc"
                        ? "descending"
                        : "none"
                    }
                    title="Sort by rating"
                  >
                    Rating
                    <ArrowUpDown
                      className={`w-4 h-4 transition-opacity ${
                        ratingSort ? "opacity-100" : "opacity-50"
                      }`}
                    />
                  </button>
                </th>
              </tr>
            </thead>

            <tbody>
              {displayedReports.map((report, index) => (
                <tr
                  key={report.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/reports/${report.id}`)}
                  onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") &&
                    navigate(`/reports/${report.id}`)
                  }
                  className="group cursor-pointer border-t border-border hover:bg-accent/5 focus:bg-accent/10 outline-none"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <td className="px-4 py-4 text-foreground group-hover:text-accent transition-colors">
                    {report.name}
                  </td>
                  <td className="px-4 py-4">
                    {new Date(report.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium
                                 bg-emerald-500/10 text-emerald-600"
                    >
                      {report.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-medium text-foreground">
                    {report.rating}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {displayedReports.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <Film className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No reports found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search query
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
