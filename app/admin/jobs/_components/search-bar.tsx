"use client";
import AddJobModal from "./add-job-modal";

export default function SearchBar() {
  return (
    <div className="flex items-center">
      <div className="ml-auto flex items-center gap-2">
        <AddJobModal />
      </div>
    </div>
  );
}