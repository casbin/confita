import React from "react";
import Conference from "./Conference";
import * as ConferenceBackend from "./backend/ConferenceBackend";

const owner = "admin";
const conferenceName = "conference_0";

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      conferenceName: conferenceName,
      conference: null,
    };
  }

  componentWillMount() {
    this.getConference();
  }

  getConference() {
    ConferenceBackend.getConference(owner, this.state.conferenceName)
      .then((conference) => {
        this.setState({
          conference: conference,
        });
      });
  }

  render() {
    if (this.state.conference === null) {
      return null;
    }

    return (
      <div>
        <Conference conference={this.state.conference} />
      </div>
    )
  }
}

export default HomePage;
