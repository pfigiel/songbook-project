import React from "react"
import { Header } from "../header/Header";

interface IProps {}

interface IState {
    songs: Array<string>;
}

export class Dashboard extends React.Component<IProps, IState> {
    constructor(props: IProps, state: IState) {
        super(props, state);
        this.state = {
            songs: []
        }
    }

    async componentDidMount() {
        await this.fetchSongs();
    }

    async fetchSongs() {
        const result = await fetch("https://localhost:44340/songs", {
            method: "GET",
        });
        const songs = await result.json();
        this.setState({ songs });
    }

    render() {
        return (
            <div id="dashboardWrapper">
                <Header />
                <div id="dashboardContent">Dashboard</div>
                <div id="dashboardSongs">
                    {this.state.songs}
                </div>
            </div>
        );
    }
}