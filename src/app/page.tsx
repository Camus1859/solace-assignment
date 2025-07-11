"use client";

import { ChangeEvent, useEffect, useState } from "react";

export default function Home() {
  interface Advocate {
    id: string;
    firstName: string;
    lastName: string;
    city: string;
    degree: string;
    specialties: string[];
    yearsOfExperience: number;
    phoneNumber: string;
  }

  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch("/api/advocates");
        if (!res.ok) throw new Error(res.statusText);

        const json = await res.json();
        setAdvocates(json.data);
      } catch (err) {
        console.error(err);
        setError("Unable to load advocates. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  const term = searchTerm.toLowerCase().trim();

  const visibleAdvocates = advocates.filter((advocate) => {
    if (!term) return true;
    return (
      advocate.firstName.toLowerCase().includes(term) ||
      advocate.lastName.toLowerCase().includes(term) ||
      advocate.city.toLowerCase().includes(term) ||
      advocate.degree.toLowerCase().includes(term) ||
      advocate.specialties.some((s) => s.toLowerCase().includes(term)) ||
      advocate.yearsOfExperience.toString().includes(term)
    );
  });

  const onChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(e.target.value);

  const onClick = () => setSearchTerm("");

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-600" />
        <p className="ml-2">Loading advocates&hellip;</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-600 py-10">{error}</p>;
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Solace Advocates</h1>
      <br />
      <br />
      <div className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium" htmlFor="advocate-search">
            Search advocates
          </label>
          <input
            id="advocate-search"
            className="border border-gray-400 rounded px-2 py-1"
            value={searchTerm}
            onChange={onChange}
            placeholder="Type a name, city, etc."
          />
          <span className="text-xs text-gray-500 mt-1">
            {searchTerm && <>Searching for “{searchTerm}”</>}
          </span>
        </div>
        <button
          onClick={onClick}
          className="text-blue-600 underline text-sm"
        >
          Reset
        </button>
      </div>
      <br />
      <br />
      <div className="overflow-x-auto">
        <table className="text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left text-sm font-medium uppercase">
                First Name
              </th>
              <th className="px-3 py-2 text-left text-sm font-medium uppercase">
                Last Name
              </th>
              <th className="px-3 py-2 text-left text-sm font-medium uppercase">
                City
              </th>
              <th className="px-3 py-2 text-left text-sm font-medium uppercase">
                Degree
              </th>
              <th className="px-3 py-2 text-left text-sm font-medium uppercase">
                Specialties
              </th>
              <th className="px-3 py-2 text-left text-sm font-medium uppercase">
                Years of Experience
              </th>
              <th className="px-3 py-2 text-left text-sm font-medium uppercase">
                Phone Number
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleAdvocates.length === 0 ? (
              <p className="py-4 text-gray-600">
                No advocates match “{searchTerm}”.
              </p>
            ) : (
              visibleAdvocates.map((advocate) => (
                <tr
                  key={`${advocate.firstName}-${advocate.lastName}`}
                  className="odd:bg-white even:bg-gray-50 hover:bg-blue-50"
                >
                  <td className="px-3 py-1">{advocate.firstName}</td>
                  <td className="px-3 py-1">{advocate.lastName}</td>
                  <td className="px-3 py-1">{advocate.city}</td>
                  <td className="px-3 py-1">{advocate.degree}</td>
                  <td className="px-3 py-1">
                    <div className="max-h-20 overflow-y-auto space-x-1">
                      {advocate.specialties.map((s) => (
                        <span
                          key={s}
                          className="bg-gray-200 text-gray-800 text-xs px-2  rounded mb-1"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="px-3 py-1">{advocate.yearsOfExperience}</td>
                  <td className="px-3 py-1">{advocate.phoneNumber}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
