import React from "react";
import { Header } from "./Header";
import { FormattedMessage } from "react-intl";
import { CurrentLanguage, AvailableLanguages } from "../utils/IntlProviderWrapper";
import { config } from "../utils/config";
import { SongsService } from "../services/SongsService";
import { appContext } from "../utils/AppContext";
import { ISong } from "../models/ISong";
import { ActionResult } from "../utils/ActionResult";

export const EditMode = {
    ADD: "add",
    MODIFY: "modify"
}

export interface LocationState {
    mode: string;
    song: ISong;
}

interface IProps {
    location: any
}

interface IState {
    id: number;
    title: string;
    originalTitle: string;
    artist: string;
    arrangement: string;
    language: string;
    text: string;
    isSongAddingError: boolean;
}

export class SongEditScreen extends React.Component<IProps, IState> {
    state: IState = {
        id: 0,
        title: "",
        originalTitle: "",
        artist: "",
        arrangement: "",
        language: CurrentLanguage(),
        text: "",
        isSongAddingError: false,
    }

    songsService: SongsService;
    mode: string;

    constructor(props: IProps, state: IState) {
        super(props, state);
        this.songsService = new SongsService();
        this.mode = this.props.location.state.mode;
    }

    componentDidMount() {
        if (this.mode == EditMode.MODIFY) {
            this.setState({
                id: this.props.location.state.song.id,
                title: this.props.location.state.song.title,
                originalTitle: this.props.location.state.song.originalTitle,
                artist: this.props.location.state.song.artist,
                arrangement: this.props.location.state.song.arrangement,
                language: this.props.location.state.song.language.code,
                text: this.props.location.state.song.text,
            });
        }
    }

    isSongDataValid = () => {
        return this.state.title !== "" && this.state.originalTitle !== "" && AvailableLanguages.includes(this.state.language) && this.state.text !== "";
    }

    onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();

        if (!this.isSongDataValid()) {
            this.setState({ isSongAddingError: true });
            return;
        }

        let result = new ActionResult();

        if (this.mode == EditMode.ADD) {
            result = await this.songsService.addSong(
                this.state.title, this.state.originalTitle, this.state.artist, this.state.arrangement, this.state.language, this.state.text);
        } else {
            result = await this.songsService.modifySong(
                this.state.id, this.state.title, this.state.originalTitle, this.state.artist, this.state.arrangement, this.state.language, this.state.text)
        }
        
        
        if (result.isSuccess) {
            appContext.history.push(config.clientRoutes.dashboard);
        } else {
            this.setState({ isSongAddingError: true });
        }
    }

    onTitleChange = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({ title: event.currentTarget.value });
    }

    onOriginalTitleChange = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({ originalTitle: event.currentTarget.value });
    }

    onArtistChange = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({ artist: event.currentTarget.value });
    }

    onArrangementChange = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({ arrangement: event.currentTarget.value });
    }

    onLanguageChange = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({ language: event.currentTarget.value });
    }

    onTextChange = (event: React.FormEvent<HTMLTextAreaElement>) => {
        this.setState({ text: event.currentTarget.value });
    }

    render() {
        return (
            <>
            <Header />
                <div id="songEditScreen">
                    <form onSubmit={this.onSubmit}>
                        <label>
                            <FormattedMessage
                                id="songsList.title"
                                defaultMessage="Title" />
                        </label>
                        <input onChange={this.onTitleChange}
                            defaultValue={this.mode === EditMode.MODIFY ? this.props.location.state.song.title : ""} />

                        <label>
                            <FormattedMessage
                                id="songsList.originalTitle"
                                defaultMessage="Original title" />
                        </label>
                        <input onChange={this.onOriginalTitleChange}
                            defaultValue={this.mode === EditMode.MODIFY ? this.props.location.state.song.originalTitle : ""} />

                        <label>
                            <FormattedMessage
                                id="songsList.artist"
                                defaultMessage="Artist" />
                        </label>
                        <input onChange={this.onArtistChange}
                            defaultValue={this.mode === EditMode.MODIFY ? this.props.location.state.song.artist : ""} />

                        <label>
                            <FormattedMessage
                                id="songsList.arrangement"
                                defaultMessage="Arrangement" />
                        </label>
                        <input onChange={this.onArrangementChange}
                            defaultValue={this.mode === EditMode.MODIFY ? this.props.location.state.song.arrangement : ""} />

                        <label>
                            <FormattedMessage
                                id="songsList.language"
                                defaultMessage="Language" />
                        </label>
                        <input onChange={this.onLanguageChange}
                            defaultValue={this.mode === EditMode.MODIFY ? this.props.location.state.song.language.code : CurrentLanguage()} />

                        <label>
                            <FormattedMessage
                                id="songEditScreen.text"
                                defaultMessage="Text" />
                        </label>
                        <textarea onChange={this.onTextChange}
                            defaultValue={this.mode === EditMode.MODIFY ? this.props.location.state.song.text : ""} />

                        <button type="submit">
                            {this.mode == EditMode.ADD ? (
                                <FormattedMessage
                                    id="songsList.addSong"
                                    defaultMessage="Add song" />
                            ) : (
                                <FormattedMessage
                                    id="songEditScreen.modifySong"
                                    defaultMessage="Modify song" />
                            )}
                        </button>

                        {this.state.isSongAddingError && (
                            <FormattedMessage
                                id="songEditScreen.editError"
                                defaultMessage="Error while saving the song, please try again" />
                        )}
                    </form>
                </div>
            </>
        );
    }
}