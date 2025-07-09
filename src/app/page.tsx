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
    return <p>Loading advocates…</p>;
  }

  if (error) {
    return <p className="text-red-300">{error}</p>;
  }

  return (
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div>
        <p>Search</p>
        <p>
          Searching for: <span>{searchTerm}</span>
        </p>
        <input
          style={{ border: "1px solid black" }}
          onChange={onChange}
          value={searchTerm}
        />
        <button onClick={onClick}>Reset Search</button>
      </div>
      <br />
      <br />
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>City</th>
            <th>Degree</th>
            <th>Specialties</th>
            <th>Years of Experience</th>
            <th>Phone Number</th>
          </tr>
        </thead>

        <tbody>
          {visibleAdvocates.map((advocate, i) => {
            return (
              <tr key={`${advocate.firstName}-${advocate.lastName}`}>
                <td>{advocate.firstName}</td>
                <td>{advocate.lastName}</td>
                <td>{advocate.city}</td>
                <td>{advocate.degree}</td>
                <td>
                  {advocate.specialties.map((s, i) => (
                    <div key={i}>{s}</div>
                  ))}
                </td>
                <td>{advocate.yearsOfExperience}</td>
                <td>{advocate.phoneNumber}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
