import React from "react";
import { FormattedMessage } from "react-intl";
import { appContext } from "../utils/AppContext";
import { config } from "../utils/config";
import { ISong } from "../models/ISong";
import { SongScreenSettingsMenu } from "./SongScreenSettingsMenu";
import { SongScreenService } from "../services/SongScreenService";

interface IProps {
  location: {
    state: {
      songs: Array<ISong>;
      startSongIndex: number;
    };
  };
}

interface IState {
  activeSongIndex: number;
  activeSong: any;
  isMenuVisible: boolean;
  fontSize: number;
  textPaddingTop: number;
  lineHeight: number;
  songSectionsCount: number;
}

const DisplayModes = {
  CHORDS_OVER_TEXT: "CHORDS_OVER_TEXT",
  CHORDS_NEXT_TO_TEXT: "CHORDS_NEXT_TO_TEXT",
  NO_CHORDS: "NO_CHORDS"
};

export class SongScreen extends React.Component<IProps, IState> {
  service: SongScreenService = new SongScreenService();
  transposition: number = 0;
  displayMode: string = DisplayModes.NO_CHORDS;
  fontHeightToWidthRatio: number = 0.5;

  constructor(props: IProps) {
    super(props);
    this.state = {
      activeSong: <div></div>,
      activeSongIndex: props.location.state.startSongIndex,
      fontSize: 20,
      lineHeight: 30,
      textPaddingTop: 0,
      isMenuVisible: false,
      songSectionsCount: 1
    }

    this.switchToPrevSong = this.switchToPrevSong.bind(this);
    this.switchToNextSong = this.switchToNextSong.bind(this);
  }

  componentDidMount() {
    this.setState({
      activeSong: this.parseSong(
        this.props.location.state.songs[this.props.location.state.startSongIndex].text
      ),
    });
    window.onresize = () => {
      this.setState({
        activeSong: this.parseSong(
          this.props.location.state.songs[this.props.location.state.startSongIndex].text
        ),
      });
    }
  }

  calculateTextSectionHeight(): number {
    return window.innerHeight - 40 - 30 - 40 - 40 - 25 - 40;
  }

  calculateTextSectionWidth(): number {
    return window.innerWidth - 40 - 40;
  }

  switchToNextSong() {
    const parsedText = this.parseSong(
      this.props.location.state.songs[this.state.activeSongIndex + 1].text
    );
    this.setState({
      activeSongIndex: this.state.activeSongIndex + 1,
      activeSong: parsedText
    });
  }

  switchToPrevSong() {
    const parsedText = this.parseSong(
      this.props.location.state.songs[this.state.activeSongIndex - 1].text
    );
    this.setState({
      activeSongIndex: this.state.activeSongIndex - 1,
      activeSong: parsedText
    });
  }

  parseLine(textLine: string): [string[], string[]] {
    const lineTextChunks: string[] = new Array<string>();
    let lineChords: string[] = new Array<string>();
    textLine
      .split(/{|}/)
      .map((element, index) =>
        index % 2 === 0
          ? lineTextChunks.push(element)
          : lineChords.push(element)
      );
    lineChords = lineChords.length !== 0 ? lineChords.map(lc => this.service.translateChord(lc, this.transposition)) : [" "];

    return [lineTextChunks, lineChords];
  }

  calculateMaxFontSize = (songSections: string[][]): { fontSize: number, numberOfColumns: number, breakIndexes: number[] } => {
    //debugger;
    const totalLineCount = songSections.flat().length;
      
    const maxLineLength = this.displayMode === DisplayModes.CHORDS_NEXT_TO_TEXT ?
      Math.max(...songSections.flat().map(line => line.replace(/[{}$]/, "").replace(/[0-9]+/, "XX").length)) :
      Math.max(...(songSections.flat().map(line => line.replace(/{[^{]+}/, "").length)));

    let maxFontSize = 0;
    let currentFontSize = 0;
    let currentColumnCount = 1;
    let breakIndexes: number[] = [];

    while (currentFontSize >= maxFontSize && songSections.length >= currentColumnCount) {
      let lineCounter = 0;
      const tempBreakIndexes = [0];
      for (let i = 0; i < songSections.length - 1; i++) {
        lineCounter += songSections[i].length;
        if (lineCounter >= totalLineCount / currentColumnCount * (tempBreakIndexes.length)) {
          tempBreakIndexes.push(i);
        }
      }

      const maxLineLengthAllColumns = currentColumnCount * maxLineLength;

      if (currentColumnCount == 1) {
        const maxFontSizePerHeightSingleColumn = Math.floor(this.calculateTextSectionHeight() / (totalLineCount + songSections.length - 1) / 3) *
          (this.displayMode !== DisplayModes.CHORDS_OVER_TEXT ? 2 : 1);
        const maxFontSizePerWidthSingleColumn = Math.floor(this.calculateTextSectionWidth() / maxLineLengthAllColumns / this.fontHeightToWidthRatio);
        
        currentFontSize = Math.min(maxFontSizePerHeightSingleColumn, maxFontSizePerWidthSingleColumn);
        maxFontSize = currentFontSize;
        breakIndexes = tempBreakIndexes;
      } else {
        const sectionsChunks = [];
        for (let i = 1; i < tempBreakIndexes.length; i++) {
          sectionsChunks.push(songSections.slice(tempBreakIndexes[i-1], tempBreakIndexes[i]));
        }
        const maxFontSizePerHeight = Math.floor(this.calculateTextSectionHeight() / Math.max(...sectionsChunks.map(sc => sc.length)) /
          3 * (this.displayMode !== DisplayModes.CHORDS_OVER_TEXT ? 2 : 1));
        const maxFontSizePerWidth = Math.floor((this.calculateTextSectionWidth() - 40) / maxLineLengthAllColumns / this.fontHeightToWidthRatio);

        currentFontSize = Math.min(maxFontSizePerHeight, maxFontSizePerWidth);
        if (currentFontSize > maxFontSize) {
          maxFontSize = currentFontSize;
          breakIndexes = tempBreakIndexes;
        }
      }

      currentColumnCount++;
    }
    
    // const maxFontSizePerHeightSingleColumn = Math.floor(this.calculateTextSectionHeight() / (totalLineCount + songSections.length - 1) / 3) *
    //   (this.displayMode !== DisplayModes.CHORDS_OVER_TEXT ? 2 : 1);
    // const maxFontSizePerWidthSingleColumn = Math.floor(this.calculateTextSectionWidth() / maxLineLengthSingleColumn / this.fontHeightToWidthRatio);
    
    // let lineCounter = 0;
    // let lastSectionInFirstColumnIndex = 0;
    // for (let i = 0; i < songSections.length; i++) {
    //   lastSectionInFirstColumnIndex = i;
    //   lineCounter += songSections[i].length;
    //   if (lineCounter >= totalLineCount / 2) {
    //     break;
    //   }
    // }
  
    // const maxLineLengthTwoColumns = 2 * maxLineLengthSingleColumn;
    // const maxFontSizePerHeightTwoColumns = Math.floor(
    //   this.calculateTextSectionHeight() / Math.max(
    //     songSections.slice(0, lastSectionInFirstColumnIndex + 1).flat().length +
    //     (songSections.slice(0, lastSectionInFirstColumnIndex + 1).length - 1),
    //     songSections.slice(lastSectionInFirstColumnIndex + 1, songSections.length).flat().length +
    //     (songSections.slice(lastSectionInFirstColumnIndex + 1, songSections.length).length - 1)) / 3 *
    //     (this.displayMode !== DisplayModes.CHORDS_OVER_TEXT ? 2 : 1));
    // const maxFontSizePerWidthTwoColumns = Math.floor((this.calculateTextSectionWidth() - 40) / maxLineLengthTwoColumns / this.fontHeightToWidthRatio)
  
    // const maxFontSizeSingleColumn = Math.min(maxFontSizePerHeightSingleColumn, maxFontSizePerWidthSingleColumn);
    // const maxFontSizeTwoColumns = Math.min(maxFontSizePerHeightTwoColumns, maxFontSizePerWidthTwoColumns);
  
    return {
      fontSize: maxFontSize,
      numberOfColumns: currentColumnCount,
      breakIndexes: breakIndexes.slice(1, breakIndexes.length)
    }
  }

  parseSong = (rawText: string) => {
    const songSections = rawText
      .split(/[=]+/)
      .filter(ss => ss !== "")
      .map(ss => ss.trim())
      .map(ss => ss.split("\n")
      .map(line => line.trim()));

      const { fontSize, numberOfColumns, breakIndexes } = this.calculateMaxFontSize(songSections);
      const isSingleColumnStragedy = numberOfColumns === 1;
      const lastSectionInFirstColumnIndex = breakIndexes[0];

      this.setState({
        fontSize,
        lineHeight: fontSize * (this.displayMode !== DisplayModes.CHORDS_OVER_TEXT ? 1.5 : 3),
        textPaddingTop: isSingleColumnStragedy ?
          (this.calculateTextSectionHeight() - fontSize * (this.displayMode !== DisplayModes.CHORDS_OVER_TEXT ? 1.5 : 3) * (songSections.flat().length + songSections.length - 1)) * 2 / 5 :
          (this.calculateTextSectionHeight() - fontSize * (this.displayMode !== DisplayModes.CHORDS_OVER_TEXT ? 1.5 : 3) * (songSections.slice(0, lastSectionInFirstColumnIndex + 1).flat().length + songSections.slice(0, lastSectionInFirstColumnIndex + 1).length - 1)) * 2 / 5
      });
      
      const textLinesHtml: any[][] = [];
      const chordLinesHtml: any[][] = [];
  
      for (let i = 0; i < songSections.length; i++) {
        textLinesHtml[i] = [];

        if (this.displayMode === DisplayModes.CHORDS_NEXT_TO_TEXT) {
          chordLinesHtml[i] = [];
          for (const textLine of songSections[i].filter(tl => tl !== "")) {
            const parsedLine = this.parseLine(textLine);
            const textLineHtml = new Array<any>();
      
            for (let i = 0; i < parsedLine[0].length; i++) {
              textLineHtml.push(<span>{parsedLine[0][i]}</span>);
            }
      
            const chordLineHtml = new Array<any>();
            for (let i = 0; i < parsedLine[1].length; i++) {
              chordLineHtml.push(<span className="chordNextToText">{parsedLine[1][i]} </span>);
            }
      
            textLinesHtml[i].push(<p className="textLine" style={{ lineHeight: `${this.state.lineHeight}px` }}>{textLineHtml}</p>);
            chordLinesHtml[i].push(<p className="textLine" style={{ lineHeight: `${this.state.lineHeight}px` }}>{chordLineHtml}</p>);
          }
          textLinesHtml[i].push(<br/>);
          chordLinesHtml[i].push(<br/>);
        } else {
          for (const textLine of songSections[i].filter(tl => tl !== "")) {
            const parsedLine = this.parseLine(textLine);
            const textLineHtml = new Array<any>();
            
            if (this.displayMode === DisplayModes.CHORDS_OVER_TEXT) {
              for (let i = 0; i < parsedLine[0].length + parsedLine[1].length; i++) {
                i % 2 !== 0
                  ? textLineHtml.push(
                      <span className="chordOverText">{parsedLine[1][Math.floor(i / 2)]}</span>
                    )
                  : textLineHtml.push(<span>{parsedLine[0][i / 2]}</span>);
              }
            } else {
              for (let i = 0; i < parsedLine[0].length; i++) {
                textLineHtml.push(<span>{parsedLine[0][i]}</span>);
              }
            }
      
            textLinesHtml[i].push(<p className="textLine chordsOverText" style={{ lineHeight: `${this.state.lineHeight}px` }}>{textLineHtml}</p>);
          }
          textLinesHtml[i].push(<br/>);
        }
      }

      if (isSingleColumnStragedy) {
        const innards: any[] = [];
        for (let i = 0; i < songSections.length; i++) {
          if (this.displayMode === DisplayModes.CHORDS_NEXT_TO_TEXT) {
            innards.push(
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ marginRight: "10px", whiteSpace: "nowrap" }}>{textLinesHtml[i]}</div>
                <div style={{ whiteSpace: "nowrap", textAlign: "right" }}>{chordLinesHtml[i]}</div>
              </div>
            )
          } else {
            innards.push(
              <div>{textLinesHtml[i]}</div>
            )
          }
        }
  
        return (
          <div>
            {innards}
          </div>
        );
      } else {
        const leftColumnInnards: any[] = [];
        const rightColumnInnards: any[] = [];
  
        for (let i = 0; i <= lastSectionInFirstColumnIndex; i++) {
          leftColumnInnards.push(
            <div style={{ display: "flex", justifyContent: "space-between", marginRight: "20px" }}>
              <div style={{ marginRight: "10px", whiteSpace: "nowrap" }}>{textLinesHtml[i]}</div>
              {this.displayMode === DisplayModes.CHORDS_NEXT_TO_TEXT && <div style={{ whiteSpace: "nowrap" }}>{chordLinesHtml[i]}</div>}
            </div>
          )
        }
  
        for (let i = lastSectionInFirstColumnIndex + 1; i < songSections.length; i++) {
          rightColumnInnards.push(
            <div style={{ display: "flex", justifyContent: "space-between", marginLeft: "20px" }}>
              <div style={{ marginRight: "10px", whiteSpace: "nowrap" }}>{textLinesHtml[i]}</div>
              {this.displayMode === DisplayModes.CHORDS_NEXT_TO_TEXT && <div style={{ whiteSpace: "nowrap" }}>{chordLinesHtml[i]}</div>}
            </div>
          )
        }
  
        return (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex", flexDirection: "column", width: "50%" }}>{leftColumnInnards}</div>
            <div style={{ display: "flex", flexDirection: "column", width: "50%" }}>{rightColumnInnards}</div>
          </div>
        );
      }
  }

  onTransposeUp = () => {
    this.transposition = this.transposition + (1 % 24);
    this.setState({
      activeSong: this.parseSong(
        this.props.location.state.songs[
          this.props.location.state.startSongIndex
        ].text
      )
    });
  };

  onTransposeDown = () => {
    this.transposition = this.transposition > 0 ? this.transposition - 1 : 23;
    this.setState({
      activeSong: this.parseSong(
        this.props.location.state.songs[
          this.props.location.state.startSongIndex
        ].text
      )
    });
  };

  onChordsOverTextDisplayModeClick = () => {
    this.displayMode = DisplayModes.CHORDS_OVER_TEXT;
    this.setState({ activeSong: this.parseSong(this.props.location.state.songs[this.props.location.state.startSongIndex].text) });
  }

  onChordsNextToTextDisplayModeClick = () => {
    this.displayMode = DisplayModes.CHORDS_NEXT_TO_TEXT;
    this.setState({ activeSong: this.parseSong(this.props.location.state.songs[this.props.location.state.startSongIndex].text) });
  }

  onNoChordsDisplayModeClick = () => {
    this.displayMode = DisplayModes.NO_CHORDS;
    this.setState({ activeSong: this.parseSong(this.props.location.state.songs[this.props.location.state.startSongIndex].text) });
  }

  render() {
    return (
      <div id="songScreenWrapper">
        <div id="menuWrapper">
          <button
            onClick={() => this.setState({ isMenuVisible: !this.state.isMenuVisible })}
            id="menuButton">
              <FormattedMessage id="songScreen.settings" defaultMessage="Settings" />
            </button>
          {this.state.isMenuVisible &&
            <SongScreenSettingsMenu
              onTransposeUp={this.onTransposeUp}
              onTransposeDown={this.onTransposeDown}
              onChordsOverTextDisplayModeClick={this.onChordsOverTextDisplayModeClick}
              onChordsNextToTextDisplayModeClick={this.onChordsNextToTextDisplayModeClick}
              onNoChordsDisplayModeClick={this.onNoChordsDisplayModeClick}
            />
          }
        </div>
        <h1 id="songTitleHeader">
          {this.props.location.state.songs[this.state.activeSongIndex].title}
        </h1>
        <div id="songText" style={{ fontSize: this.state.fontSize, paddingTop: this.state.textPaddingTop }}>{this.state.activeSong}</div>
        <div id="songScreenNavButtonsWrapper">
          <button
            disabled={
              this.props.location.state.songs[
                this.state.activeSongIndex - 1
              ] === undefined
            }
            onClick={this.switchToPrevSong}
          >
            <FormattedMessage
              id="songScreen.previous"
              defaultMessage="Previous"
            />
          </button>
          <button
            onClick={() =>
              appContext.history.push(config.clientRoutes.dashboard)
            }
          >
            <FormattedMessage
              id="common.goToDashboard"
              defaultMessage="Go to Dashboard"
            />
          </button>
          <button
            disabled={
              this.props.location.state.songs[
                this.state.activeSongIndex + 1
              ] === undefined
            }
            onClick={this.switchToNextSong}
          >
            <FormattedMessage id="songScreen.next" defaultMessage="Next" />
          </button>
        </div>
      </div>
    );
  }
}
