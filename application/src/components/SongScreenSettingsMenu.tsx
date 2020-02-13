import React from "react";
import { FormattedMessage } from "react-intl";

interface IProps {
    onTransposeUp: () => void;
    onTransposeDown: () => void;
    onChordsOverTextDisplayModeClick: () => void;
    onChordsNextToTextDisplayModeClick: () => void;
    onNoChordsDisplayModeClick: () => void;
}

export class SongScreenSettingsMenu extends React.Component<IProps> {
    render() {
        return (
            <div>
                <div>
                    <button onClick={this.props.onTransposeUp}>
                        <FormattedMessage id="songScreen.transposeUp" defaultMessage="Transpose up" />
                    </button>
                    <button onClick={this.props.onTransposeDown}>
                        <FormattedMessage id="songScreen.transposeDown" defaultMessage="Transpose down" />    
                    </button>
                </div>
                <div>
                    <button onClick={this.props.onChordsOverTextDisplayModeClick}>
                        <FormattedMessage id="songScreen.chordsOverText" defaultMessage="Chords over text" />
                    </button>
                    <button onClick={this.props.onChordsNextToTextDisplayModeClick}>
                        <FormattedMessage id="songScreen.chordsNextToText" defaultMessage="Chords next to text" />
                    </button>
                    <button onClick={this.props.onNoChordsDisplayModeClick}>
                        <FormattedMessage id="songScreen.noChords" defaultMessage="No chords" />
                    </button>
                </div>
            </div>
        );
    }
}