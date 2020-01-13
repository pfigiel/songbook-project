import React from "react";
import { appContext } from "../utils/AppContext";
import { ISong } from "../models/ISong";
import { FormattedMessage } from "react-intl";
import { config } from "../utils/config";
import { StorageService } from "../services/StorageService";
import { Roles } from "../services/identity/Roles";
import { SongsService } from "../services/SongsService";
import { EditMode, LocationState } from "./SongEditScreen";
import { User, State } from "../store/models/State";
import { connect } from "react-redux";

interface IProps {
  user: User;
}

interface IState {
  songs: Array<ISong>;
  isLoading: boolean;
}

const mapStateToProps = (state: State) => {
  return {
    user: state.user
  };
};

class UnconnectedSongsList extends React.Component<IProps, IState> {
  state: IState = {
    isLoading:
    false, songs: []
  };
  
  songsService: SongsService;

  constructor(props: IProps, state: IState) {
    super(props, state);
    this.songsService = new SongsService();
  }

  async componentDidMount() {
    this.fetchSongs();
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
        <th>{song.originalTitle}</th>
        <th>{song.artist}</th>
        <th>{song.arrangement}</th>
        <th>
          <button onClick={() => this.onViewSongButtonClick(index)}>
            <FormattedMessage id="dashboard.view" defaultMessage="View" />
          </button>
          <button onClick={() => this.onModifySongButtonClick(song)}>
            <FormattedMessage id="dashboard.modify" defaultMessage="Modify" />
          </button>
          <button onClick={() => this.onDeleteSongButtonClick(song)}>
            <FormattedMessage id="dashboard.delete" defaultMessage="Delete" />
          </button>
        </th>
      </tr>
    );
  }

  onViewSongButtonClick = (index: number) => {
    appContext.history.push(config.clientRoutes.song, {
      songs: this.state.songs,
      startSongIndex: index
    });
  }

  onModifySongButtonClick = (song: ISong) => {
    appContext.history.push(config.clientRoutes.editSong, { mode: EditMode.MODIFY, song } as LocationState);
  }

  onDeleteSongButtonClick = async (song: ISong) => {
    const deleteResult = await this.songsService.deleteSong(song.id);
    if (deleteResult.isSuccess) {
      const songs: ISong[] = this.state.songs;
      songs.splice(songs.indexOf(song), 1);
      this.setState({ songs });
    }
  }

  onAddSongButtonClick = () => {
    appContext.history.push(config.clientRoutes.editSong, { mode: EditMode.ADD } as LocationState);
  }

  render() {
    return (
      <div id="songsListWrapper">
        {this.state.isLoading ? (
          <div>
            {/*TODO: add spinner*/}
            <FormattedMessage id="common.loading"
              defaultMessage="Loading" />
          </div>
        ) : (
            <div id="songsListContent">
              <table>
                <thead>
                  <tr>
                    <th>
                      <FormattedMessage id="songsList.title" defaultMessage="Title" />
                    </th>
                    <th>
                      <FormattedMessage id="songsList.originalTitle" defaultMessage="Original title" />
                    </th>
                    <th>
                      <FormattedMessage id="songsList.artist" defaultMessage="Artist" />
                    </th>
                    <th>
                      <FormattedMessage id="songsList.arrangement" defaultMessage="Arrangement" />
                    </th>
                    <th>
                      <FormattedMessage id="songsList.actions" defaultMessage="Actions" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.songs.map((song, index) =>
                    this.generateSongRow(song, index)
                  )}
                </tbody>
              </table>
              {this.props.user.roles.includes(Roles.ADMIN) && (
                <button onClick={this.onAddSongButtonClick}>
                  <FormattedMessage id="songsList.addSong" defaultMessage="Add song" />
                </button>
              )}
            </div>
          )}
      </div>
    );
  }
}

const SongsList = connect(mapStateToProps)(UnconnectedSongsList);
export { SongsList };