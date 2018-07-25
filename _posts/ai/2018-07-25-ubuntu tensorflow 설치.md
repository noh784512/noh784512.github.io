---
layout: post
title:  "ubuntu에 tensorflow 설치"
date:   2018-07-25 00:43:59
author: hyunwoo
categories: algorithm
---

3~4학년때 진행했던 프로젝트를 복습하려고 tensorflow를 설치했는데, 계속 오류나서 개고생했다.
다른 사람들 블로그 보는 것보다 tensorflow 홈페이지를 통해 설치하는게 훨씬 쉬웠다.

cpu , python3 기준

```
sudo apt-get install python3-pip python3-dev 
```
```
python-virtualenv
```
```
mkdir ~/tensorflow
```
```
cd ~/tensorflow
```
```
virtualenv --system-site-packages -p python3 venv
```
```
source ~/tensorflow/venv/bin/activate
```
```
pip install -U tensorflow
```

그대로 따라하면 된다. jupyter에서도 tensorflow 를 사용하려면 다음 과정을 진행하면된다.

```
source ~/tensorflow/bin/activate
```
```
pip3 install ipykernel
```
```
python -m ipykernel install --user --name=tensorflow
```


