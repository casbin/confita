import {AutoComplete, Col, message, Row} from "antd";
import React from "react";
import {isMobile as isMobileDevice} from "react-device-detect";

const { Option } = AutoComplete;

export let ServerUrl = '';

export function initServerUrl() {
  const hostname = window.location.hostname;
  if (hostname === 'localhost') {
    ServerUrl = `http://${hostname}:12000`;
  }
}

export function parseJson(s) {
  if (s === "") {
    return null;
  } else {
    return JSON.parse(s);
  }
}

export function myParseInt(i) {
  const res = parseInt(i);
  return isNaN(res) ? 0 : res;
}

export function openLink(link) {
  // this.props.history.push(link);
  const w = window.open('about:blank');
  w.location.href = link;
}

export function goToLink(link) {
  window.location.href = link;
}

export function goToLinkSoft(ths, link) {
  ths.props.history.push(link);
}

export function showMessage(type, text) {
  if (type === "") {
    return;
  } else if (type === "success") {
    message.success(text);
  } else if (type === "error") {
    message.error(text);
  }
}

export function isAdminUser(account) {
  return account?.isAdmin;
}

export function deepCopy(obj) {
  return Object.assign({}, obj);
}

export function addRow(array, row) {
  return [...array, row];
}

export function prependRow(array, row) {
  return [row, ...array];
}

export function deleteRow(array, i) {
  // return array = array.slice(0, i).concat(array.slice(i + 1));
  return [...array.slice(0, i), ...array.slice(i + 1)];
}

export function swapRow(array, i, j) {
  return [...array.slice(0, i), array[j], ...array.slice(i + 1, j), array[i], ...array.slice(j + 1)];
}

export function isMobile() {
  // return getIsMobileView();
  return isMobileDevice;
}

export function getFormattedDate(date) {
  if (date === undefined || date === null) {
    return null;
  }

  date = date.replace('T', ' ');
  date = date.replace('+08:00', ' ');
  return date;
}

export function getFormattedDateShort(date) {
  return date.slice(0, 10);
}

export function getShortName(s) {
  return s.split('/').slice(-1)[0];
}

export function getFriendlyFileSize(size) {
  if (size < 1024) return size + ' B'
  let i = Math.floor(Math.log(size) / Math.log(1024))
  let num = (size / Math.pow(1024, i))
  let round = Math.round(num)
  num = round < 10 ? num.toFixed(2) : round < 100 ? num.toFixed(1) : round
  return `${num} ${'KMGTPEZY'[i-1]}B`
}

export function getResourceThumbnail(resource) {
  if (resource.type === "image") {
    return (
      <img src={resource.url} alt={resource.name} height={30} />
    )
  } else if (resource.type === "video") {
    return (
      <video height={50} controls>
        <source src={resource.url} type="video/mp4" />
      </video>
    )
  } else {
    return null;
  }
}

export function getResourceOptions(resources, task="") {
  return (
    resources.filter(resource => resource.task === "" || resource.task === task).map((resource, index) =>
      <Option key={index} value={resource.url}>
        <Row>
          <Col span={4} >
            {
              getResourceThumbnail(resource)
            }
          </Col>
          <Col span={20} >
            {`${resource.task === "" ? "（全局）" : resource.task} | ${resource.name} | `}
          </Col>
        </Row>
      </Option>
    )
  )
}

function getRandomInt(s) {
  let hash = 0;
  if (s.length !== 0) {
    for (let i = 0; i < s.length; i++) {
      let char = s.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
  }

  return hash;
}

export function getAvatarColor(s) {
  const colorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];
  let random = getRandomInt(s);
  if (random < 0) {
    random = -random;
  }
  return colorList[random % 4];
}
