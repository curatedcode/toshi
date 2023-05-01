import { type NextPage } from "next";
import { useState } from "react";
import Layout from "~/components/Layout";
import { api } from "~/utils/api";

const CreateListPage: NextPage = () => {
  const { mutate: createList } = api.list.create.useMutation();

  const [name, setName] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);
  const [description, setDescription] = useState("");

  function handleVisibilityChange(option: "private" | "public") {
    if (option === "public") return setIsPrivate(false);
    return setIsPrivate(true);
  }

  return (
    <Layout
      title="Create a list | Toshi"
      description="Create a list on Toshi.com"
    >
      <form
        onSubmit={() => createList({ name, description, isPrivate })}
        className="flex flex-col"
      >
        <div className="flex flex-col">
          <label htmlFor="name">Title</label>
          <input
            id="name"
            type="text"
            value={name}
            required
            onChange={(e) => setName(e.currentTarget.value)}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            rows={6}
            value={name}
            onChange={(e) => setDescription(e.currentTarget.value)}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="visibility">Visibility</label>
          <select id="visibility">
            <option
              value="private"
              onSelect={() => handleVisibilityChange("private")}
            >
              Private
            </option>
            <option
              value="public"
              onSelect={() => handleVisibilityChange("public")}
            >
              Public
            </option>
          </select>
        </div>
        <button type="submit">Create list</button>
      </form>
    </Layout>
  );
};

export default CreateListPage;
