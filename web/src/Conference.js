// Copyright 2021 The casbin Authors. All Rights Reserved.
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
import {Alert, Button, Col, Empty, Menu, Popover, Row, Space, Steps} from "antd";
import * as Setting from "./Setting";
import i18next from "i18next";

const {SubMenu} = Menu;
const {Step} = Steps;
class Conference extends React.Component {
  constructor(props) {
    super(props);
    // noinspection JSAnnotator
    this.state = {
      classes: props,
      // selectedKey: this.props.conference.defaultItem,
      conference: {
        owner: "admin",
        name: "casbin",
        createdTime: "2021-11-26T22:30:44+08:00",
        displayName: "Casbin”2022全球开源软件大赛：赛道二“Casdoor单点登录系统",
        type: "Competition",
        introduction: "近年来，开源软件的应用场景不断延伸。在传统软件行业，开源软件逐渐应用于操作系统、数据库、云计算、大数据、机器学习等多个流程。",
        startDate: "2022-10-10",
        endDate: "2022-10-31",
        organizer: "Casbin大赛组委会",
        carousels: ["https://storage.googleapis.com/kaggle-competitions/kaggle/15696/logos/header.png?t=2019-10-04-16-16-53",
          "https://cdn.casbin.org/img/casdoor-logo_1185x256.png"],
        carouselHeight: "200",
        tags: [],
        datasetUrl: "",
        datasetPreviewUrl: "",
        previewData: "",
        resultUrl: "",
        bonus: 1200,
        personCount: 43,
        displayState: "",
        status: "Public",
        language: "en",
        location: "Beijing, China",
        address: "3663 Zhongshan Road North",
        enableSubmission: false,
        defaultItem: "赛题与数据",
        treeItems: [{
          "key": "赛题与数据",
          "title": "赛题与数据",
          "content": "<h2 style=\"text-align:start;text-indent:2em;\"><strong>赛题描述</strong></h2><p style=\"text-align:start;text-indent:2em;\">表位（Epitope）是存在于抗原表面的，决定抗原特异性的特殊性结构的化学基团称为抗原决定簇，又称表位。抗原通过表位与相应淋巴细胞表面抗原受体结合，从而激活胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原淋巴细胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原分子可具有一种或多种不同的表位，其大小相当于相应抗体的抗原结合部位，每种表位只有一种抗原特异性。因此，表位是被免疫细胞识别的靶结构，也是免疫反应具有特异性的基础，其性质、数目和空间构型决定着抗原的特异性。与之对应的抗体结合部位（Paratope）是与抗原表位相结合的抗体上的位点。</p><div class=\"media-wrap image-wrap\"><img src=\"https://img.alicdn.com/imgextra/i2/O1CN01RhvCUS1qnMywOOeWa_!!6000000005540-...",
          "titleEn": "赛题与数据",
          "contentEn": "<h2 style=\"text-align:start;text-indent:2em;\"><strong>赛题描述</strong></h2><p style=\"text-align:start;text-indent:2em;\">表位（Epitope）是存在于抗原表面的，决定抗原特异性的特殊性结构的化学基团称为抗原决定簇，又称表位。抗原通过表位与相应淋巴细胞表面抗原受体结合，从而激活淋巴细胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原分子可胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原原胞，引起免疫应答；抗原也借此与相应抗体或致敏淋巴细胞发生特异性结合。单个抗原具有一种或多种不同的表位，其大小相当于相应抗体的抗原结合部位，每种表位只有一种抗原特异性。因此，表位是被免疫细胞识别的靶结构，也是免疫反应具有特异性的基础，其性质、数目和空间构型决定着抗原的特异性。与之对应的抗体结合部位（Paratope）是与抗原表位相结合的抗体上的位点。</p><div class=\"media-wrap image-wrap\"><img src=\"https://img.alicdn.com/imgextra/i2/O1CN01RhvCUS1qnMywOOeWa_!!6000000005540-...",
          "children": [],
        },
        {
          "key": "赛制",
          "title": "赛制",
          "content": "<p style=\"text-align:start;text-indent:2em;\"><strong>“云上进化”2022全球AI生物智药大赛赛道二“抗原抗体结合Epitope和Paratope精准确定”</strong></p><h2 style=\"text-align:start;text-indent:2em;\"><strong>背景介绍</strong></h2><p style=\"text-align:start;text-indent:2em;\">近年来，AI+医疗的应用场景不断延伸。在传统制药行业，AI逐渐应用于药物靶点发现、虚拟筛选、化合物/生物结构合成、理化性质预测等多个流程。由SARS-CoV-2（新型冠状病毒）引发的疫情，从2019年底出现开始，就给世界人民的生命健康安全带来了巨大的威胁。面对全球疫情的多次反弹、病毒的快速变异、疫苗突破性感染率上升，小分子药的无后遗症治愈复杂有难度，通过广谱中和抗体在新冠病毒暴露人群进行应急预防和早期治疗，成为巩固疫苗接种形成的免疫屏障的重要手段。为了加快推进广谱中和抗体研发进度，AI的辅助必不可少。在一些创新药物研发的细分领...",
          "titleEn": "赛制",
          "contentEn": "<p style=\"text-align:start;text-indent:2em;\"><strong>“云上进化”2022全球AI生物智药大赛赛道二“抗原抗体结合Epitope和Paratope精准确定”</strong></p><h2 style=\"text-align:start;text-indent:2em;\"><strong>背景介绍</strong></h2><p style=\"text-align:start;text-indent:2em;\">近年来，AI+医疗的应用场景不断延伸。在传统制药行业，AI逐渐应用于药物靶点发现、虚拟筛选、化合物/生物结构合成、理化性质预测等多个流程。由SARS-CoV-2（新型冠状病毒）引发的疫情，从2019年底出现开始，就给世界人民的生命健康安全带来了巨大的威胁。面对全球疫情的多次反弹、病毒的快速变异、疫苗突破性感染率上升，小分子药的无后遗症治愈复杂有难度，通过广谱中和抗体在新冠病毒暴露人群进行应急预防和早期治疗，成为巩固疫苗接种形成的免疫屏障的重要手段。为了加快推进广谱中和抗体研发进度，AI的辅助必不可少。在一些创新药物研发的细分领...",
          "children": [],
        },
        {
          "key": "二级菜单",
          "title": "二级菜单",
          "content": "二级菜单",
          "titleEn": "二级菜单",
          "contentEn": "二级菜单",
          "children": [{}, {}],
        },
        {
          "key": "容器镜像",
          "title": "容器镜像",
          "content": "<h2 style=\"text-align:start;text-indent:2em;\"><strong>提交说明</strong></h2><p style=\"text-align:start;text-indent:2em;\">平台提供了基于GPU计算资源的提交镜像的方式，将本地代码打包成镜像提交，推送至阿里云容器镜像仓库后，在天池提交页面中输入镜像地址、用户名和仓库密码。由比赛平台拉取镜像运行，运行结束即可在成绩页面查询评测结果和日志。</p><h2 style=\"text-align:start;text-indent:2em;\"><strong>1. 资源配置：</strong></h2><p style=\"text-align:start;text-indent:2em;\">GPU实例规格<code>ecs.gn7i-c16g1.4xlarge</code>(<a href=\"https://help.aliyun.com/document_detail/25378.html\" target=\"_blank\">https://help.aliyun.com/documen...",
          "titleEn": "容器镜像",
          "contentEn": "<h2 style=\"text-align:start;text-indent:2em;\"><strong>提交说明</strong></h2><p style=\"text-align:start;text-indent:2em;\">平台提供了基于GPU计算资源的提交镜像的方式，将本地代码打包成镜像提交，推送至阿里云容器镜像仓库后，在天池提交页面中输入镜像地址、用户名和仓库密码。由比赛平台拉取镜像运行，运行结束即可在成绩页面查询评测结果和日志。</p><h2 style=\"text-align:start;text-indent:2em;\"><strong>1. 资源配置：</strong></h2><p style=\"text-align:start;text-indent:2em;\">GPU实例规格<code>ecs.gn7i-c16g1.4xlarge</code>(<a href=\"https://help.aliyun.com/document_detail/25378.html\" target=\"_blank\">https://help.aliyun.com/documen...",
          "children": [],
        }],
      },
    };
  }

  handleClick = info => {
    const selectedKey = info.key;
    this.setState({
      selectedKey: selectedKey,
    });
  };

  renderMenu(treeItems) {
    let mode;
    if (!Setting.isMobile()) {
      mode = "vertical";
    } else {
      mode = "horizontal";
    }

    const theme = "light";
    // const theme = "dark";

    return (
      <Menu
        // style={{ width: 256 }}
        selectedKeys={[this.state.selectedKey]}
        defaultOpenKeys={["sub1"]}
        mode={mode}
        theme={theme}
        className={"conferenceMenu"}
        style={{border: "1px solid rgb(240,240,240)"}}
        onClick={this.handleClick}
      >
        {
          treeItems.map((treeItem, i) => {
            // if (i === 0) {
            //   return null;
            // }

            if (treeItem.children.length === 0) {
              return (
                <Menu.Item key={treeItem.title}>
                  {this.props.language !== "en" ? treeItem.title : treeItem.titleEn}
                </Menu.Item>
              );
            } else {
              return (
                <SubMenu key={treeItem.title} title={this.props.language !== "en" ? treeItem.title : treeItem.titleEn}>
                  {
                    treeItem.children.map((treeItem2, i) => {
                      return (
                        <Menu.Item key={treeItem2.title}>
                          {this.props.language !== "en" ? treeItem2.title : treeItem2.titleEn}
                        </Menu.Item>
                      );
                    })
                  }
                </SubMenu>
              );
            }
          })
        }
        {/* <Menu.Item key="1" icon={<MailOutlined />}>*/}
        {/*  Introduction*/}
        {/* </Menu.Item>*/}
        {/* <Menu.Item key="1" icon={<MailOutlined />}>*/}
        {/*  Committees*/}
        {/* </Menu.Item>*/}
        {/* <Menu.Item key="1" icon={<MailOutlined />}>*/}
        {/*  Hosting Organizations*/}
        {/* </Menu.Item>*/}
        {/* <Menu.Item key="2" icon={<CalendarOutlined />}>*/}
        {/*  Navigation Two*/}
        {/* </Menu.Item>*/}
        {/* <SubMenu key="sub1" icon={<AppstoreOutlined />} title="Navigation Two">*/}
        {/*  <Menu.Item key="3">Option 3</Menu.Item>*/}
        {/*  <Menu.Item key="4">Option 4</Menu.Item>*/}
        {/*  <SubMenu key="sub1-2" title="Submenu">*/}
        {/*    <Menu.Item key="5">Option 5</Menu.Item>*/}
        {/*    <Menu.Item key="6">Option 6</Menu.Item>*/}
        {/*  </SubMenu>*/}
        {/* </SubMenu>*/}
        {/* <SubMenu key="sub2" icon={<SettingOutlined />} title="Navigation Three">*/}
        {/*  <Menu.Item key="7">Option 7</Menu.Item>*/}
        {/*  <Menu.Item key="8">Option 8</Menu.Item>*/}
        {/*  <Menu.Item key="9">Option 9</Menu.Item>*/}
        {/*  <Menu.Item key="10">Option 10</Menu.Item>*/}
        {/* </SubMenu>*/}
        {/* <Menu.Item key="link" icon={<LinkOutlined />}>*/}
        {/*  <a href="https://ant.design" target="_blank" rel="noopener noreferrer">*/}
        {/*    Ant Design*/}
        {/*  </a>*/}
        {/* </Menu.Item>*/}
      </Menu>
    );
  }

  getSelectedTreeItem(treeItems) {
    if (this.state.selectedKey === null) {
      return null;
    }

    const res = treeItems.map(treeItem => {
      if (treeItem.title === this.state.selectedKey) {
        return treeItem;
      } else {
        return this.getSelectedTreeItem(treeItem.children);
      }
    }).filter(treeItem => treeItem !== null);

    if (res.length > 0) {
      return res[0];
    } else {
      return null;
    }
  }

  renderPage(treeItem) {
    if (treeItem === undefined || treeItem === null) {
      return (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      );
    }

    return (
      <div>
        {/* <div style={{textAlign: "center", fontSize: "x-large"}}>*/}
        {/*  {*/}
        {/*    treeItem.title*/}
        {/*  }*/}
        {/* </div>*/}
        <div style={{marginTop: "40px"}} dangerouslySetInnerHTML={{__html: this.props.language !== "en" ? treeItem.content : treeItem.contentEn}} />
      </div>
    );
  }

  renderCompetition(conference, conferencetree) {
    // eslint-disable-next-line no-console
    console.log(conference);
    if (conference.type !== "Competition") {
      return null;
    }
    const mode = "horizontal";

    const theme = "light";
    return (
      <div style={{marginTop: "20px", marginBottom: "20px"}}>
        <Alert
          banner
          showIcon={false}
          style={{backgroundImage: "url(https://storage.googleapis.com/kaggle-competitions/kaggle/15696/logos/header.png?t=2019-10-04-16-16-53)", backgroundRepeat: "no-repeat", backgroundSize: "100% 100%"}}
          message={
            <h2 style={{color: "white", fontWeight: "700"}}>
              <span style={{marginRight: "10px"}}>
                {conference.displayName}
              </span>
              {
                Setting.getTag(conference.displayState)
              }
            </h2>}
          description={<div style={{color: "white"}}>
            <h3>
              {conference.introduction}
            </h3>
            <div>
              {i18next.t("conference:Organizer")}: {conference.organizer}
            </div>
            <br />
            {i18next.t("conference:Person count")} <span style={{marginLeft: "10px", fontSize: 20, color: "rgb(255,77,79)"}}>{conference.personCount}</span>
            <span style={{float: "right", color: "white", fontWeight: "700"}}>
              {
                Setting.getTags(conference.tags)
              }
            </span>
            <br />
          </div>}
          type="info"
          action={
            <Space direction="vertical" style={{textAlign: "center"}}>
              &nbsp;
              <div style={{fontSize: 30, color: "rgb(255,77,79)"}}>
                 ￥{`${conference.bonus}`.replace("000", ",000")}
              </div>
              <Button style={{marginTop: "20px"}} shape={"round"} type="primary" onClick={() => this.props.history.push("/submissions")}>
                {i18next.t("conference:Apple Now")}
              </Button>
              <Button style={{marginTop: "10px"}} shape={"round"} type="primary" danger onClick={() => Setting.openLinkSafe(conference.resultUrl)}>
                {i18next.t("conference:View Result")}
              </Button>
            </Space>
          }
        />
        <Menu
          // style={{ width: 256 }}
          selectedKeys={[this.state.selectedKey]}
          defaultOpenKeys={["sub1"]}
          mode={mode}
          theme={theme}
          className={"conferenceMenu"}
          style={{border: "1px solid rgb(240,240,240)"}}
          onClick={this.handleClick}
        >
          {
            conferencetree.map((treeItem, i) => {
              // if (i === 0) {
              //   return null;
              // }

              if (treeItem.children.length === 0) {
                return (
                  <Menu.Item key={treeItem.title}>
                    {this.props.language !== "en" ? treeItem.title : treeItem.titleEn}
                  </Menu.Item>
                );
              } else {
                return (
                  <SubMenu key={treeItem.title} title={this.props.language !== "en" ? treeItem.title : treeItem.titleEn}>
                    {
                      treeItem.children.map((treeItem2, i) => {
                        return (
                          <Menu.Item key={treeItem2.title}>
                            {this.props.language !== "en" ? treeItem2.title : treeItem2.titleEn}
                          </Menu.Item>
                        );
                      })
                    }
                  </SubMenu>
                );
              }
            })
          }
          {/* <Menu.Item key="1" icon={<MailOutlined />}>*/}
          {/*  Introduction*/}
          {/* </Menu.Item>*/}
          {/* <Menu.Item key="1" icon={<MailOutlined />}>*/}
          {/*  Committees*/}
          {/* </Menu.Item>*/}
          {/* <Menu.Item key="1" icon={<MailOutlined />}>*/}
          {/*  Hosting Organizations*/}
          {/* </Menu.Item>*/}
          {/* <Menu.Item key="2" icon={<CalendarOutlined />}>*/}
          {/*  Navigation Two*/}
          {/* </Menu.Item>*/}
          {/* <SubMenu key="sub1" icon={<AppstoreOutlined />} title="Navigation Two">*/}
          {/*  <Menu.Item key="3">Option 3</Menu.Item>*/}
          {/*  <Menu.Item key="4">Option 4</Menu.Item>*/}
          {/*  <SubMenu key="sub1-2" title="Submenu">*/}
          {/*    <Menu.Item key="5">Option 5</Menu.Item>*/}
          {/*    <Menu.Item key="6">Option 6</Menu.Item>*/}
          {/*  </SubMenu>*/}
          {/* </SubMenu>*/}
          {/* <SubMenu key="sub2" icon={<SettingOutlined />} title="Navigation Three">*/}
          {/*  <Menu.Item key="7">Option 7</Menu.Item>*/}
          {/*  <Menu.Item key="8">Option 8</Menu.Item>*/}
          {/*  <Menu.Item key="9">Option 9</Menu.Item>*/}
          {/*  <Menu.Item key="10">Option 10</Menu.Item>*/}
          {/* </SubMenu>*/}
          {/* <Menu.Item key="link" icon={<LinkOutlined />}>*/}
          {/*  <a href="https://ant.design" target="_blank" rel="noopener noreferrer">*/}
          {/*    Ant Design*/}
          {/*  </a>*/}
          {/* </Menu.Item>*/}
        </Menu>
      </div>
    );
  }
  rendersteps(conference) {
    return (
      <Steps style={{marginTop: "20px"}} current={1} progressDot={(dot, {status, index}) => {
        return (
          <Popover
            content={
              <span>
                    step {index} status: {status}
              </span>
            }>
            {dot}
          </Popover>
        );
      }}>
        <Step title="报名" description="04/06-05/11" />
        <Step title="初赛" description="06/01-07/31" />
        <Step title="复赛" description="08/01-09/30" />
        <Step title="决赛" description="09/30" />
      </Steps>
    );
  }
  render() {
    const conference = this.state.conference;

    if (!Setting.isMobile()) {
      return (
        <div>
          <Row>
            <Col span={24} >
              {
                this.renderCompetition(conference, conference.treeItems)
              }
            </Col>
          </Row>
          <Row>
            <Col span={4} >
              {
                this.renderMenu(conference.treeItems)
              }
            </Col>
            <Col span={1} >
            </Col>
            <Col span={19} >
              {
                this.renderPage(conference.treeItems[0])
              }
            </Col>
          </Row>
          <Row>
            <Col span={2}></Col>
            <Col span={20}>
              {this.rendersteps(conference.treeItems[0])}
            </Col>
            <Col span={2}></Col>
          </Row>
        </div>
      );
    } else {
      return (
        <div>
          <Row>
            <Row>
              <Col span={24} >
                {
                  this.renderCompetition(conference)
                }
              </Col>
            </Row>
            <Col span={24} >
              {
                this.renderMenu(conference.treeItems)
              }
            </Col>
          </Row>
          <Row>
            <Col span={1} />
            <Col span={22} >
              {
                this.renderPage(this.getSelectedTreeItem(conference.treeItems[0]))
              }
            </Col>
            <Col span={1} />
          </Row>
        </div>
      );
    }
  }
}

export default Conference;
