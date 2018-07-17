---
layout: post
title:  "백준 1644 소수의 연속합"
date:   2018-07-11 10:43:59
author: hyunwoo
categories: algorithm
---

문제 : https://www.acmicpc.net/problem/1644


풀이의 핵심 
+ 소수 구하기
+ 부분합 구하기 


~~~
#include<iostream>
#include<cstring>
#include<math.h>
#include<vector>
#include<string>


using namespace std;

int N;
int arr[4000000];

void find_prime(int n)
{
	for (int i = 2; i*i<=n; i++)
	{
		if (arr[i])
		{
			for (int j = i * i; j <= n; j+=i)
				arr[j] = 0;
		}
	}
}

int main()
{
	int siz = 0;
	vector<int> v;
	cin >> N;
	memset(arr, 0, N+1 * sizeof(int));
	for (int i = 2; i <= N; i++)
	{
		arr[i] = 1;
	}
	find_prime(N);
	for (int i = 2; i <= N; i++)
	{
		if (arr[i])
		{
			v.push_back(i);
		}
	}

	int tot = 0;
	int sum = 0;
	int low = 0, high = 0;
	while(true)
	{
		if (sum>N)
		{
			sum = sum - v[low];
			low++;
		}
		else if(high == v.size())
		{
			break;
		}
		else 
		{
			sum = sum + v[high];
			high++;
		}
		if(sum==N)
		{
			tot++;
		}
	}
	cout << tot;
}
~~~
