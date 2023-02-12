# Huge file sorter

## Задача:

Написать программу, которая сможет отсортировать файл размером 1 ТБ, состоящий из строк на машине, на
которой доступно 500 МБ ОЗУ.

___
# Выбор стратегии сортировки

Необходимо определиться, какая из двух возможных стратегий сортировки будет применена. Внутренняя(Internal) или внешняя(External). Обратимся к теории:

| Internal Sort                                                                                      | External Sort                                                                                                                |
|----------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------|
| Internal sorting is used when the input data can be adjusted in the main memory all at once.       | External sorting is used when the input data cannot be adjusted in the main memory all at once.                              |
| The data to be sorted should be small enough to fit in the main memory.                            | It is used when data to be sorted cannot fit into the main memory all at once.                                               |
| The storage device used in this method is only main memory (RAM)                                   | Both Secondary memory (Hard Disk) and Main memory are used in this method.                                                   |
| While sorting is in progress, all the data to be sorted is stored in the main memory at all times. | While sorting, data is loaded into the Main memory in small chunks, all data is stored outside the memory like on Hard Disk. |
| Algorithms Used for Internal Sort are Bubble sort, Insertion Sort, Quick sort, Heap sort, etc.     | Algorithms Used for External Sort are Merge sort, Tape Sort, External radix sort, etc.                                       |


Исходя из условия задачи - ограничение ОЗУ, очевидно, что применяться будет сортировка внешнего типа tape sorting.
Это распространенный подход для сортировки больших наборов данных при ограниченном объеме памяти.

___
# Реализация
Алгоритм внешней сортировки будет реализован следующим образом:
* `input.txt` файл размером 1 ТБ будет разделен на более мелкие фрагменты - `chunks`, которые записываются в память
* `chunks` будут иметь определенный размер, который в коде будет задан (в МБ)
```javascript
const BLOCK_SIZE = 500 * 1024 * 1024
```
* системной функцией `sort` будет произведена сортировка в каждом `chunk`'е
* после сортировки каждый `chunk` будет записан во временный файл с помощью функции `fs.writeFile`.
* финальный этап - слияние `chunks` в один отсортированный файл `output.txt` функцией `mergeChunks`

___
## Проверка
Проверим работоспособность алгоритма на виртуальной машине, на которой доступно 500 МБ ОЗУ, а предстоит ей отсортировать файл размером ~700 мб:
* программа успешно отсортировала `input.txt`
* был сгенерирован отсортированный файл `output.txt`

___
## Проверка Internal Sort

В качестве эксперемнта, попробуем отсортировать этот же файл, но только внутренней сортировой - [**bubbleShort**](https://github.com/faringet/algorithms_and_sorts/blob/master/src/main/java/sorts/BubbleSortIO.java).

Ограничим `heap` в JVM теми же 500 МБ и, как ожидалось, получим `java.lang.OutOfMemoryError: Java heap space` - не хватает места в куче, а именно, в области памяти в которую помещаются объекты.

Отпустим лимиты `heap` чтобы удостовериться что сортировка работает и дело было в нехватке ОЗУ:

![](https://github.com/faringet/huge_file_sorter/blob/master/screenshots/bubble_infit_heap1.png)

Исходя из изысканий выше, можно сделать вывод что изначальный выбор в пользу внешней сортировки в решении задачи был правильный. Также мне удалось проверить работу сортировок на реальном примере.


___
## Порядок запуска приложения:
1. Поместить файл `input.txt` в корень приложения
2. Запустить приложение `node app.js`
3. Открыть сгенерированный файл `output.txt` и убедиться в совершенной сортировке
