---
layout: post
title:  "quick sort"
date:   2018-08-15 16:33:00
categories: algorithm
---

quick sort
----

![p](C:\Users\noh78\Desktop\blog\noh784512.github.io\assets\sort.jpg)

quick sort의 경우 시간복잡도의 최악은 O(N^2)이지만 최악의 경우가 나올 경우는 극히 드물다. 또한 merge sort보다 보통 빠르다고 알려져있다. quick sort는 정렬을 하기 위해 배열이 따로 필요하지 않지만, merge sort는 N만큼의 추가적인 공간이 필요하기 때문에 N이 커졌을 경우 속도 차이가 발생한다.

참고할만한 사이트 : (http://asfirstalways.tistory.com/338)

코드    (마지막 원소를 pivot으로 정한 경우)
----
```
#include<iostream>
#include<string>
#include<cstring>

using namespace std;

int arr[10] = { 0,1,2,1,2,5,3,6,1,9 };

int partition(int left, int pivot_ind)
{
	int i = left-1;
	int tmp;
	for (int j = left; j < pivot_ind; j++)
	{
		if (arr[j] > arr[pivot_ind])
			continue;
		i++;
		tmp = arr[i];
		arr[i] = arr[j];
		arr[j] = tmp;
	}
	tmp = arr[i + 1];
	arr[i + 1] = arr[pivot_ind];
	arr[pivot_ind] = tmp;
	return i + 1;
}

void quick_sort(int left, int right )
{
	int pivot_index;
	if (left < right)
	{
		pivot_index = partition(left, right);
		quick_sort(left, pivot_index - 1);
		quick_sort(pivot_index + 1, right);
	}
}

int main()
{
	quick_sort(0, 7);
	for (int i = 0; i < 8; i++)
		cout << arr[i] << " ";
}
```



  
  
  
















