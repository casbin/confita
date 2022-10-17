// Copyright 2022 The casbin Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React from "react";
import {readString} from "react-papaparse";
import ReactDataSheet from "react-datasheet";
import "react-datasheet/lib/react-datasheet.css";

class CsvTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      grid: null,
    };
  }

  render() {
    if (this.props.conference === null) {
      return null;
    }

    if (this.state.grid === null) {
      const csvString = this.props.conference.previewData;
      readString(csvString, {
        worker: true,
        complete: (results) => {
          this.setState({
            grid: results.data.map((row, i) => {
              return row.map(cell => {
                return {value: cell, readOnly: i === 0};
              });
            }),
          });
          // console.log(results);
        },
      });
      return null;
    }

    return (
      <div>
        <ReactDataSheet
          data={this.state.grid}
          valueRenderer={cell => cell.value}
        />
      </div>
    );
  }
}

export default CsvTable;
