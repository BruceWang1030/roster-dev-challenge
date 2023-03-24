import React, { useState, useEffect } from "react";
import {
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Checkbox,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/AddCircle";

import axios from "axios";
import "./ArtistTable.css";

const API_URL = "http://localhost:8080";

const ArtistTable = () => {
  const [artists, setArtists] = useState([]);
  const [newArtist, setNewArtist] = useState({
    artist: "",
    rate: 0,
    streams: 0,
    payout_completed: false,
  });
  const [editArtist, setEditArtist] = useState(null);

  useEffect(() => {
    async function fetchArtists() {
      const response = await axios.get(`${API_URL}/artists`);
      setArtists(response.data);
    }
    fetchArtists();
  }, []);

  async function handleCreateArtist(event) {
    event.preventDefault();
    const response = await axios.post(`${API_URL}/artists`, newArtist);
    setArtists([...artists, response.data]);
    setNewArtist({});
  }

  async function handleDeleteArtist(id) {
    await axios.delete(`${API_URL}/artists/${id}`);
    setArtists(artists.filter((artist) => artist._id !== id));
  }

  function handleInputChange(event) {
    setNewArtist({ ...newArtist, [event.target.name]: event.target.value });
  }

  function handleEditArtist(id) {
    const artistToEdit = artists.find((artist) => artist._id === id);
    setEditArtist(artistToEdit);
  }

  async function handleUpdateArtist(event) {
    event.preventDefault();
    const response = await axios.put(
      `${API_URL}/artists/${editArtist._id}`,
      editArtist
    );
    const updatedArtists = artists.map((artist) =>
      artist._id === response.data._id ? response.data : artist
    );
    setArtists(updatedArtists);
    setEditArtist(null);
  }

  function calculateAveragePayoutPerMonth(artist) {
    const monthsSinceLaunch = (new Date().getFullYear() - 2006) * 12;
    const totalPayout = artist.rate * artist.streams;
    return (totalPayout / monthsSinceLaunch).toFixed(2);
  }

  return (
    <div className="centered-table">
      <TableContainer component={Paper} style={{ width: "90%" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Artist Name</TableCell>
              <TableCell>Payment rate per stream</TableCell>
              <TableCell>Number of Streams</TableCell>
              <TableCell>Payout Amount</TableCell>
              <TableCell>Avg. Payout per Month</TableCell>
              <TableCell>Payout Complete</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {artists
              .sort((a, b) => b.rate * b.streams - a.rate * a.streams)
              .map((artist) => (
                <TableRow
                  key={artist._id}
                  className={artist.payoutComplete ? "completed" : ""}
                >
                  {editArtist && editArtist._id === artist._id ? (
                    <>
                      <TableCell>
                        <form onSubmit={handleUpdateArtist}>
                          <input
                            type="text"
                            name="artist"
                            placeholder="Artist"
                            value={editArtist.artist}
                            onChange={(event) =>
                              setEditArtist({
                                ...editArtist,
                                artist: event.target.value,
                              })
                            }
                          />
                        </form>
                      </TableCell>
                      <TableCell>
                        <form onSubmit={handleUpdateArtist}>
                          <input
                            type="number"
                            name="rate"
                            placeholder="Rate"
                            value={editArtist.rate}
                            onChange={(event) =>
                              setEditArtist({
                                ...editArtist,
                                rate: event.target.value,
                              })
                            }
                          />
                        </form>
                      </TableCell>
                      <TableCell>{artist.streams}</TableCell>
                      <TableCell>{artist.rate * artist.streams}</TableCell>
                      <TableCell>
                        {calculateAveragePayoutPerMonth(artist)}
                      </TableCell>
                      <TableCell>
                        <form onSubmit={handleUpdateArtist}>
                          <Checkbox
                            name="payoutComplete"
                            checked={editArtist.payoutComplete}
                            onChange={(event) =>
                              setEditArtist({
                                ...editArtist,
                                payoutComplete: event.target.checked,
                              })
                            }
                          />
                        </form>
                      </TableCell>
                      <TableCell>
                        <IconButton type="submit" onClick={handleUpdateArtist}>
                          <SaveIcon />
                        </IconButton>
                        <IconButton
                          type="button"
                          onClick={() => setEditArtist(null)}
                        >
                          <CancelIcon />
                        </IconButton>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>
                        <strong>{artist.artist}</strong>
                      </TableCell>
                      <TableCell>{artist.rate}</TableCell>
                      <TableCell>{artist.streams}</TableCell>
                      <TableCell>
                        {(artist.rate * artist.streams).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {calculateAveragePayoutPerMonth(artist)}
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          checked={artist.payoutComplete}
                          disabled
                          color="primary"
                          inputProps={{ "aria-label": "disabled checkbox" }}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleEditArtist(artist._id)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteArtist(artist._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            <TableRow>
              <TableCell>
                <TextField
                  type="text"
                  name="artist"
                  placeholder="Artist"
                  value={newArtist.artist || ""}
                  onChange={handleInputChange}
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="number"
                  name="rate"
                  placeholder="Rate"
                  value={newArtist.rate || ""}
                  onChange={handleInputChange}
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="number"
                  name="streams"
                  placeholder="Streams"
                  value={newArtist.streams || ""}
                  onChange={handleInputChange}
                />
              </TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell>
                <IconButton type="submit" onClick={handleCreateArtist}>
                  <AddIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ArtistTable;
