import React from "react"
import { Header } from "../header/Header";

interface IProps {
    song: any;
}

export class SongScreen extends React.Component<IProps, {}> {
    render() {
        return (
            <div id="songScreenWrapper">
                <Header />
                { this.props.song }
            </div>
        );
    }
}