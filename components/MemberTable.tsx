"use client";

export default function MemberTable() {
  const members = [
    { id: "#1234", name: "Krunal P.", books: 1 },
    { id: "#1235", name: "Vasant Chauhan", books: 3 },
  ];

  return (
    <div className="bg-white p-4 rounded shadow mt-6">
      <h3 className="font-bold mb-2">New Members</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500">
            <th>Name</th>
            <th>ID</th>
            <th>Total Books</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m, i) => (
            <tr key={i} className="border-t">
              <td>{m.name}</td>
              <td>{m.id}</td>
              <td>{m.books}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
