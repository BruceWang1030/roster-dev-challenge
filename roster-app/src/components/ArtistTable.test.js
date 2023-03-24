import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ArtistTable from "./ArtistTable";

describe("ArtistTable", () => {
  const mockArtists = [
    {
      _id: "641d1559cd62a0fe68a0abe1",
      artist: "JPearl Jam",
      rate: 0.004,
      streams: 10284436,
      payoutComplete: false,
    },
    {
      _id: "641d1559cd62a0fe68a0abe2",
      artist: "The Beatles",
      rate: 0.00735,
      streams: 23300412,
      payoutComplete: true,
    },
  ];

  beforeEach(() => {
    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockArtists),
      })
    );
  });

  afterEach(() => {
    global.fetch.mockRestore();
  });

  it("should display a list of artists", async () => {
    render(<ArtistTable />);
    const artistName1 = await screen.findByText(mockArtists[0].artist);
    const artistName2 = await screen.findByText(mockArtists[1].artist);

    expect(artistName1).toBeInTheDocument();
    expect(artistName2).toBeInTheDocument();
  });

  it("should successfully add a new artist", async () => {
    render(<ArtistTable />);
    const artistNameInput = screen.getByPlaceholderText("Artist");
    const rateInput = screen.getByPlaceholderText("Rate");
    const streamsInput = screen.getByPlaceholderText("Streams");
    const addButton = screen.getByRole("button", { name: "AddCircle" });

    fireEvent.change(artistNameInput, { target: { value: "New TEST Artist" } });
    fireEvent.change(rateInput, { target: { value: "0.25" } });
    fireEvent.change(streamsInput, { target: { value: "100" } });
    fireEvent.click(addButton);

    const newArtistName = await screen.findByText("New TEST Artist");
    const newArtistRate = await screen.findByText("0.25");

    expect(newArtistName).toBeInTheDocument();
    expect(newArtistRate).toBeInTheDocument();
  });

  it("should successfully edit an artist", async () => {
    render(<ArtistTable />);
    const editButton = await screen.findByRole("button", { name: "Edit" });

    fireEvent.click(editButton);

    const artistNameInput = await screen.findByPlaceholderText("Artist");
    const rateInput = await screen.findByPlaceholderText("Rate");
    const payoutCompleteCheckbox = await screen.findByRole("checkbox");

    fireEvent.change(artistNameInput, {
      target: { value: "Edited TEST Artist" },
    });
    fireEvent.change(rateInput, { target: { value: "0.15" } });
    fireEvent.click(payoutCompleteCheckbox);
    const saveButton = screen.getByRole("button", { name: "Save" });

    fireEvent.click(saveButton);

    const editedArtistName = await screen.findByText("Edited TEST Artist");
    const editedArtistRate = await screen.findByText("0.15");

    expect(editedArtistName).toBeInTheDocument();
    expect(editedArtistRate).toBeInTheDocument();
  });

  it("should successfully delete an artist", async () => {
    render(<ArtistTable />);
    const deleteButton = await screen.findByRole("button", { name: "Delete" });
    fireEvent.click(deleteButton);

    const artistName = screen.queryByText(mockArtists[0].artist);

    expect(artistName).not.toBeInTheDocument();
  });
});
