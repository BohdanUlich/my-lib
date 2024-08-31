import { getCategoryIdsFromLabels } from "@/helpers";
import { Label } from "@/types";

describe("getCategoryIdsFromLabels", () => {
  const labels: Label[] = [
    {
      id: "1",
      name: "Label 1",
      user_id: "user1",
      category_ids: ["cat1", "cat2"],
      color: "#ffffff",
    },
    {
      id: "2",
      name: "Label 2",
      user_id: "user1",
      category_ids: ["cat2", "cat3"],
      color: "#ffffff",
    },
    {
      id: "3",
      name: "Label 3",
      user_id: "user2",
      category_ids: ["cat3", "cat4"],
      color: "#ffffff",
    },
  ];

  test("returns empty array when labelIds is empty", () => {
    const categoryIds = getCategoryIdsFromLabels({ labelIds: [], labels });
    expect(categoryIds).toEqual([]);
  });

  test("returns empty array when no labels match labelIds", () => {
    const categoryIds = getCategoryIdsFromLabels({
      labelIds: ["4", "5"],
      labels,
    });
    expect(categoryIds).toEqual([]);
  });

  test("returns unique categoryIds from matching labels", () => {
    const categoryIds = getCategoryIdsFromLabels({
      labelIds: ["1", "2"],
      labels,
    });
    expect(categoryIds).toEqual(["cat1", "cat2", "cat3"]);
  });

  test("ignores labels without category_ids", () => {
    const labelsWithNoCategories: Label[] = [
      { id: "4", name: "Label 4", user_id: "user3", color: "#ffffff" },
      { id: "5", name: "Label 5", user_id: "user4", color: "#ffffff" },
    ];
    const categoryIds = getCategoryIdsFromLabels({
      labelIds: ["4", "5"],
      labels: labelsWithNoCategories,
    });
    expect(categoryIds).toEqual([]);
  });
});
