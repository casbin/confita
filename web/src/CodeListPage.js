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

import React, {createRef} from "react";
import moment from "moment";
import * as Setting from "./Setting";
import * as CodeBackend from "./backend/CodeBackend";
import i18next from "i18next";
import "./CodeListPage.less";
import {BookOutlined, CopyOutlined, DeleteOutlined, DownloadOutlined, EditOutlined, FilterOutlined, MoreOutlined, PlusOutlined, SearchOutlined} from "@ant-design/icons";
import {Pagination, Popover} from "antd";
import {mapStringToTag} from "./Utils";

/**
 *
 * @param {CodeBackend.Code} code
 * @param {CodeListPage} page
 * @returns {{icon: JSX.Element, label: string, fn: () => void, ownerOnly?: boolean }[]}
 */
const codeActions = (code, page) => ([
  {icon: <EditOutlined />, label: "code:Edit", fn: () => Setting.goToLink(`code/${code.name}`), ownerOnly: true},
  {icon: <CopyOutlined />, label: "code:Copy and Edit", fn: () => { }},
  {icon: <DownloadOutlined />, label: "code:Download", fn: () => { }},
  {icon: <BookOutlined />, label: "code:Bookmark", fn: () => { }},
  {icon: <DeleteOutlined />, label: "code:Delete", fn: () => page.deleteCode(code), ownerOnly: true},
]);

class CodeListPage extends React.Component {
  constructor(props) {
    super(props);
    /**
     * @type {{ classes: { account: any }, codes: CodeBackend.Code[], globalCodes: CodeBackend.Code[], isSearching: boolean, topActivate: boolean, searchKeywords: string[], searchTags: Setting.CodeTag[], searchResultPage: number, displayMyWork: boolean }}
     */
    this.state = {
      classes: props,
      codes: [],
      globalCodes: [],
      isSearching: false,
      topActivate: false,
      searchKeywords: [],
      searchTags: [],
      searchResultPage: 1,
      displayMyWork: false,
    };
    this.searchAreaRef = createRef();
  }

  /**
   * @param { (...arg:any) => any } fn
   */
  doIfSignin(fn) {
    return () => {
      if (this.props.account !== null && this.props.account !== undefined) {
        fn();
        return;
      }
      Setting.goToLink("/signin");
    };
  }

  UNSAFE_componentWillMount() {
    this.getGlobalCodes();
    if (this.props.account !== null && this.props.account !== undefined) {
      this.getCodes();
    }
    this.listenScroll();
  }

  listenScroll() {
    window.addEventListener("scroll", () => this.setState({
      topActivate: this.searchAreaRef.current ? this.searchAreaRef.current?.getBoundingClientRect().top <= 0 : false,
    }));
  }

  getGlobalCodes() {
    CodeBackend.getGlobalCodes()
      .then(res => {
        this.setState({
          globalCodes: res,
        });
      });
  }

  getCodes() {
    CodeBackend.getCodes(this.props.account.name)
      .then((res) => {
        this.setState({
          codes: res,
        });
      });
  }

  /**
   *
   * @returns {CodeBackend.Code}
   */
  newCode() {
    return {
      owner: this.props.account.name,
      name: `code_${this.state.codes.length}`,
      createdTime: moment().format(),
      displayName: `New Code - ${this.state.codes.length}`,
      notebook: "code",
      tags: [],
      imgUrl: "",
    };
  }

  addCode() {
    const newCode = this.newCode();
    CodeBackend.addCode(newCode)
      .then((res) => {
        Setting.showMessage("success", "Code added successfully");
        Setting.goToLink(`code/${newCode.name}`);
      }
      )
      .catch(error => {
        Setting.showMessage("error", `Code failed to add: ${error}`);
      });
  }

  /**
   *
   * @param {CodeBackend.Code} code
   */
  deleteCode(code) {
    CodeBackend.deleteCode(code)
      .then((res) => {
        Setting.showMessage("success", "Code deleted successfully");
        this.setState({
          codes: this.state.codes.filter(existedCode => existedCode.name !== code.name),
          globalCodes: this.state.globalCodes.filter(existedCode => existedCode.name !== code.name),
        });
      }
      )
      .catch(error => {
        Setting.showMessage("error", `Code failed to delete: ${error}`);
      });
  }

  /**
   *
   * @param {string[] | null} keywords
   * @param {Setting.CodeTag[] | null} tags
   */
  searchCode(keywords, tags) {
    keywords = keywords ?? this.state.searchKeywords;
    tags = tags ?? this.state.searchTags;
    // eslint-disable-next-line
    console.log(keywords, tags);
    this.setState({
      isSearching: keywords !== null && keywords.length !== 0 || tags.length !== 0,
    });
  }

  /**
   *
   * @param {Setting.CodeTag} tag
   */
  tagOnClicAction(tag) {
    if (this.state.searchTags.find(existedTag => existedTag.label === tag.label)) {
      const tags = this.state.searchTags.filter(existedTag => existedTag.label !== tag.label);
      this.setState({
        searchTags: tags,
        searchResultPage: 1,
      });
      this.searchCode(null, tags);
      return;
    }
    const tags = [...new Set([...this.state.searchTags, tag])];
    this.setState({
      searchTags: tags,
      searchResultPage: 1,
    });
    this.searchCode(null, tags);
  }

  /**
   *
   * @param {string} value
   */
  searchOnInputAction(value) {
    const keywords = value.trim().length === 0 ? [] : value.split(" ");
    this.setState({
      searchKeywords: keywords,
    });
    this.searchCode(keywords, null);
  }

  renderCodeActionsMenu(code) {
    return <ul className="code-actions-menu">
      {codeActions(code, this).filter(action => code.owner === this.props.account?.name ? true : !action.ownerOnly).map(({icon, label, fn}) =>
        <li key={code.label + label} onClick={e => {fn(); e.stopPropagation();}}>
          {icon}
          {i18next.t(label)}
        </li>)}
    </ul>;
  }

  renderTopBanner() {
    return <div className="top-banner">
      <h1>{
        this.state.displayMyWork ? i18next.t("general:Your Code") :
          i18next.t("general:Code")}
      </h1>
      <p>{!this.state.displayMyWork && i18next.t("code:Explore and run machine learning code with Confita Notebooks.")}</p>
      <div>
        <button onClick={this.doIfSignin(this.addCode.bind(this))}><PlusOutlined style={{fontSize: "large"}} />{i18next.t("code:New Notebook")}</button>
        {this.state.classes.account && <button onClick={() => this.setState({displayMyWork: !this.state.displayMyWork})}>{i18next.t(this.state.displayMyWork ? "code:Public Notebook" : "code:Your work")}</button>}
      </div>
    </div>;
  }

  /**
   *
   * @param {{ tags: Setting.CodeTag[] }} props
   */
  renderSearchArea({tags}) {

    /**
     *
     * @type {React.FC<{ category: string, tags: Setting.CodeTag[] }>}
     */
    const FilterContentRow = ({category, tags}) => <div>
      <p>{category.toUpperCase()}</p>
      <ul>
        {tags.map(tag => <li className={`${this.state.searchTags.find(existedTag => existedTag.label === tag.label) ? "clicked" : ""}`} key={tag.label} onClick={() => this.tagOnClicAction(tag)}>{tag.label}</li>)}
      </ul>
    </div>;

    const visibleEntries = Object.entries(Setting.getCodeTags()).filter(([category]) => category !== "general");

    const FilterContent = () => <div className="filter-content">
      {
        visibleEntries
          .map(([category, tags]) => ({category, tags: tags.map(mapStringToTag)}))
          .map(({category, tags}) => <FilterContentRow key={category} category={category} tags={tags} />)
      }
    </div>;

    return <div className={`search-area ${this.state.topActivate ? "top-activate" : ""}`} ref={this.searchAreaRef}>
      <div className="search-input">
        <SearchOutlined style={{fontSize: "x-large", margin: "0.1rem 1rem 0.1rem 1rem"}} />
        <input placeholder={i18next.t(`code:Search ${this.state.displayMyWork ? "" : "public"} notebooks`)} onInput={e => this.searchOnInputAction(e.currentTarget.value)}></input>
        <Popover content={<FilterContent />} trigger={"click"} placement={"bottomLeft"}>
          <div>
            <FilterOutlined style={{fontSize: "large"}} />
            Filters
          </div>
        </Popover>
      </div>
      <div className="tags-cloud">
        {tags.map(tag => <button className={`${this.state.searchTags.find(existedTag => existedTag.label === tag.label) ? "clicked" : ""}`} key={tag.label} onClick={() => this.tagOnClicAction(tag)}>{tag.label}</button>)}
      </div>
    </div>;
  }

  /**
    *
    * @param {{ rows: { tag: Setting.CodeTag, codes: CodeBackend.Code[] }[] }} props
    */
  renderCodeList({rows}) {

    /**
      *
      * @type {React.FC<{code: CodeBackend.Code}>}
      */
    const CodeListRowItem = ({code}) => {
      return <li className="code-list-row-item" onClick={() => Setting.goToLink(`code/${code.name}`)}>
        <img src={code.imgUrl} />
        <div>
          <p>{code.displayName}</p>
          <p>{code.createdTime}</p>
          <div>
            <Popover trigger={"clicked"} placement="bottomLeft" content={this.renderCodeActionsMenu(code)}>
              <button onClick={e => e.stopPropagation()}>
                <MoreOutlined />
              </button>
            </Popover>
          </div>
        </div>
        <div>
          <p>{code.owner}</p>
        </div>
      </li>;
    };

    /**
      *
      * @type {React.FC<{ tag: Setting.CodeTag ,codes: CodeBackend.Code[]}>}
      */
    const CodeListRow = ({tag, codes}) => {
      return <li className="code-list-row">
        <h2>{tag.label}</h2>
        <button onClick={() => this.tagOnClicAction(tag)}>See all&nbsp;({codes.length})</button>
        <ul>{codes.slice(0, 6).map(code => <CodeListRowItem key={code.name} code={code} />)}</ul>
      </li>;
    };

    /**
      *
      * @type {React.FC<{ rows: { tag: Setting.CodeTag, codes: CodeBackend.Code[] }[] }>}
      */
    const CodeList = ({rows}) => {
      return <ul className="code-list">
        {rows.map(({tag, codes}) => <CodeListRow key={tag.label} tag={tag} codes={codes} />)}
      </ul>;
    };

    return <CodeList rows={rows} />;
  }

  /**
   *
   * @param {{ codes: CodeBackend.Code[], keywords: string[], tags: Setting.CodeTag[] }} props
   */
  renderSearchResultList({codes, keywords, tags}) {
    /**
      *
      * @type {React.FC<{ code: CodeBackend.Code }>}
      */
    const SearchResultListRow = ({code}) => {
      return <li onClick={() => Setting.goToLink(`code/${code.name}`)}>
        <img src={code.imgUrl} alt={code.displayName + "image"} />
        <div>
          <p>{code.displayName}</p>
          <p>{code.createdTime}</p>
        </div>
        <div>
          <p>{code.owner}</p>
          <Popover trigger={"clicked"} placement="bottomLeft" content={this.renderCodeActionsMenu(code)}>
            <button onClick={e => e.stopPropagation()}>
              <MoreOutlined style={{transform: "rotate(90deg)"}} />
            </button>
          </Popover>
        </div>
      </li>;
    };

    /**
      *
      * @type {React.FC<{ codes: CodeBackend.Code[] }>}
      */
    const SearchResultList = ({codes}) => {

      const pageSize = 20;
      const page = this.state.searchResultPage;

      return <div className="search-result-list">
        <h2>Result ({codes.length})</h2>
        <ul>{codes.slice((page - 1) * pageSize, page * pageSize).map(code => <SearchResultListRow key={code.name} code={code} />)}</ul>
        <Pagination showSizeChanger={false} style={{display: "flex", justifyContent: "center", padding: "1rem"}} current={page} total={codes.length} pageSize={pageSize} onChange={page => this.setState({searchResultPage: page})} />
      </div>;
    };

    const result = codes
      .filter(code => (this.state.displayMyWork && this.props.account) ? code.owner === this.props.account.name : true)
      .filter(code => keywords
        .filter(keyword => code.displayName.toLowerCase().indexOf(keyword.toLowerCase()) !== -1).length !== 0 || keywords.length === 0)
      .filter(code => tags
        .filter(tag => tag.filter(code)).length === tags.length);
    return <SearchResultList codes={result} />;
  }

  render() {

    const tags = Object.values(Setting.getCodeTags()).flat().map(mapStringToTag);
    const rows = tags.map(tag => ({tag, codes: this.state.globalCodes?.filter(tag.filter) ?? []})).filter(row => row.codes.length !== 0);

    return <div className="code-list-page-container">
      {this.renderTopBanner()}
      {this.renderSearchArea({tags})}
      {this.state.isSearching || this.state.displayMyWork ? this.renderSearchResultList({codes: this.state.codes, keywords: this.state.searchKeywords, tags: this.state.searchTags}) : this.renderCodeList({rows})}
    </div>;
  }
}

export default CodeListPage;
