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
import {QRCodeSVG} from "qrcode.react";
import * as Conf from "./Conf";

class QrCode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
    };
  }

  render() {
    return (
      <QRCodeSVG
        value={this.props.url}
        size={256}
        bgColor={"#ffffff"}
        fgColor={"#000000"}
        level={"L"}
        includeMargin={false}
        imageSettings={{
          src: Conf.QrCodeImageUrl,
          x: null,
          y: null,
          height: 24,
          width: 24,
          excavate: true,
        }}
      />
    );
  }
}

export default QrCode;
