import React from "react";
import "./songsList.scss";
import { appContext } from "../../utils/AppContext";
import { ISong } from "../../models/ISong";
import { Button, Spinner, Table } from "react-bootstrap";
import { FormattedMessage } from "react-intl";
import { config } from "../../utils/config";

interface IState {
  songs: Array<ISong>;
  isLoading: boolean;
}

export class SongsList extends React.Component<{}, IState> {
  constructor(props: {}, state: IState) {
    super(props, state);
    this.state = {
      songs: [],
      isLoading: false
    };
  }

  async componentDidMount() {
    await this.fetchSongs();
  }

  async fetchSongs() {
    this.setState({ isLoading: true });
    const songs = await appContext.songsService.getAll();
    this.setState({ songs, isLoading: false });
  }

  generateSongRow(song: ISong, index: number) {
    return (
      <tr key={index}>
        <th>{song.title}</th>
        <th>{song.artist}</th>
        <th>
        <Button
          onClick={() =>
            appContext.history.push(config.clientRoutes.song, {
              songs: this.state.songs,
              startSongIndex: index
            })
          }
        >
          <FormattedMessage id="dashboard.view" defaultMessage="View" />
        </Button>
        </th>
      </tr>
    );
  }

  render() {
    return (
      <div id="songsListWrapper">
        {this.state.isLoading ? (
          <Spinner animation="border" />
        ) : (
          <div id="songsListContent">
            <Table hover>
                <thead>
                    <tr>
                        <th>
                            <FormattedMessage id="songsList.title" defaultMessage = "Title" />
                        </th>
                        <th>
                            <FormattedMessage id="songsList.artist" defaultMessage = "Artist" />
                            </th>
                            <th>
                                <FormattedMessage id="songsList.actions" defaultMessage = "Actions" />
                            </th>
                    </tr>
                </thead>
                <tbody>
              {this.state.songs.map((song, index) =>
                this.generateSongRow(song, index)
              )}
              </tbody>
            </Table>
          </div>
        )}
      </div>
    );
  }
}
