import React from "react";
import { Header } from "../header/Header";
import { appContext } from "../../utils/AppContext";
import { Button } from "react-bootstrap";
import { FormattedMessage } from "react-intl";

interface IProps {}

interface IState {
  songs: Array<any>;
}

export class Dashboard extends React.Component<IProps, IState> {
  constructor(props: IProps, state: IState) {
    super(props, state);
    this.state = {
      songs: []
    };
  }

  async componentDidMount() {
    await this.fetchSongs();
  }

  async fetchSongs() {
    const songs = await appContext.songsService.getAll();
    this.setState({ songs });
  }

  generateSongRow(song: any) {
    return (
      <div
        id="songRow"
        style={{
          display: "inline-flex",
          justifyContent: "space-between",
          width: "100%"
        }}
      >
        <p>{song.title}</p>
        <p>{song.artist}</p>
        <Button onClick={() => appContext.history.push("/song")}>
          <FormattedMessage id="dashboard.view" defaultMessage="View" />
        </Button>
      </div>
    );
  }

  render() {
    return (
      <div id="dashboardWrapper">
        <Header />
        <div id="dashboardContent">
          <div id="dashboardSongs">
            {this.state.songs.map(song => this.generateSongRow(song))}
          </div>
        </div>
      </div>
    );
  }
}
