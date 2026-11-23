---
title: "ML机器学习各算法代码&数据预处理"
description: ''
date: "2026-11-23"
updatedDate: "2026-11-23"
language: zh-CN
tags:
  - Machine Learning
categories:
  - Machine Learning
comments: false
---
# ML机器学习各算法代码&数据预处理

**AI 的数学基础：**

1. 输入数据（Input Data）：例如：一张猫的图像 $X$
2. 线性代数（Linear Algebra）—— 变换数据：$Z = WX + b$
3. 概率论（Probability Theory）—— 表示预测结果： $P(Y \mid X)$
4. 信息论（Information Theory）—— 衡量预测的信息代价：$\mathcal{L} = -\sum_i p_i \log q_i$  Cross-Entropy Loss（交叉熵损失函数）
5. 微积分（Calculus）—— 计算参数的梯度：$\frac{\partial \mathcal{L}}{\partial W}$
6. 最优化理论（Optimization）—— 更新模型参数： $W \leftarrow W-\eta\nabla_W\mathcal{L}$

| 数据类型             | 应用场景                     | 代表模型                 |
| -------------------- | ---------------------------- | ------------------------ |
| Tabular 表格         | 金融风控、销量预测、客户流失 | XGBoost、LightGBM        |
| Image 图像           | 图像识别、目标检测           | CNN、ViT                 |
| Text 文本            | 文本理解、文本生成           | BERT、GPT                |
| Time Series 时间序列 | 股票、天气、传感器预测       | ARIMA、LSTM、Transformer |
| Graph 图结构         | 社交网络、分子结构           | GNN                      |
| Audio 音频           | 语音识别                     | Whisper、Conformer       |



## 监督学习

### 线性回归 Linear Regression

任务：根据输入特征 X，**预测连续数值** y。   [ Regression ]

核心：找到一条最合适的直线，使预测值与真实值之间的误差尽可能小。

> 例如根据房屋面积预测房价，根据工作年限预测工资。

$$
\hat y=Xw+b
$$

- 数据点与拟合线之间的垂直距离：Residual（残差）
- \(w\)：Weight，权重或斜率。
- \(b\)：Bias，偏置或截距

损失函数：MSE（Mean Squared Error，均方误差）

评估 Metrics:

| Metric                                                    | 含义         | 趋势          |
| --------------------------------------------------------- | ------------ | ------------- |
| MAE  = $\frac{1}{n}\sum |y_i-\hat y_i |$                  | 平均绝对误差 | 越小越好      |
| MSE = $\frac{1}{n}\sum(y_i-\hat y_i)^2$                   | 均方误差     | 越小越好      |
| RMSE = $\sqrt{MSE}$                                       | 均方根误差   | 越小越好      |
| R² = $1-\frac{\sum(y_i-\hat y_i)^2} {\sum(y_i-\bar y)^2}$ | 决定系数     | 越接近 1 越好 |

```py
# 核心步骤
y_pred = X @ w + b
error = y_pred - y

dw = (2 / n) * X.T @ error
db = 2 * np.mean(error)

w -= lr * dw
b -= lr * db
```

```py
import numpy as np

# Training data
X = np.array([[1], [2], [3], [4], [5]])
y = np.array([3, 5, 7, 9, 11])  # 真实值

n_samples, n_features = X.shape

# Initialize parameters
w = np.zeros(n_features)
b = 0.0

lr = 0.01  # Learning Rate（学习率）
epochs = 1000

for epoch in range(epochs):

    # 1. Prediction
    y_pred = X @ w + b    # X @ w 矩阵乘法

    # 2. Calculate loss
    error = y_pred - y  # 预测误差
    loss = np.mean(error ** 2)  # MSE（Mean Squared Error，均方误差）

    # 3. Calculate gradients
    dw = (2 / n_samples) * X.T @ error   # X.T 转置矩阵
    db = 2 * np.mean(error)

    # 4. Update parameters
    w -= lr * dw
    b -= lr * db

print("Weight:", w)
print("Bias:", b)

# Predict new data
X_new = np.array([[6]])
print("Prediction:", X_new @ w + b)
```

实际项目如何调用（Scikit-learn）:

```py
# 核心步骤
model = Model()
model.fit(X_train, y_train)
y_pred = model.predict(X_test)
```

```py
from sklearn.datasets import load_diabetes
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score
)
import numpy as np

# 1. Load data
X, y = load_diabetes(return_X_y=True)

# 2. Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42
)

# 3. Initialize model
model = LinearRegression()

# 4. Train
model.fit(X_train, y_train)

# 5. Predict
y_pred = model.predict(X_test)

# 6. Evaluate
print("MAE:", mean_absolute_error(y_test, y_pred))
print("RMSE:", np.sqrt(mean_squared_error(y_test, y_pred)))
print("R2:", r2_score(y_test, y_pred))

# 7. Inspect parameters
print("Weights:", model.coef_)  # 获取权重
print("Bias:", model.intercept_)
```

Training（训练）与 Inference（推理）分离:

```PY
import joblib
# Save trained model
joblib.dump(model, "linear_regression.joblib")
# Load trained model
loaded_model = joblib.load("linear_regression.joblib")
# Inference
prediction = loaded_model.predict(X_test[:1])
```

### 逻辑回归 Logistic Regression

任务：输出一个 0 到 1 之间的概率   [ Classification ]   

> 例如：假设银行需要根据客户的收入、年龄、贷款金额，预测客户是否会违约：
>
> - y = 0：不会违约（Negative）
> - y = 1：会违约（Positive）

> 与 Linear Regression 的代码结构非常相似，只是在输出层增加了 Sigmoid 函数，并更换了 Loss Function

 **线性分类模型：**一个特征时，决策边界是一个点；两个特征时是一条直线；三个特征时是一个平面；更高维度时是一个 Hyperplane（超平面）。

> 需要处理非线性决策边界，可以引入 Polynomial Features，或使用 Decision Tree、SVM 等其他模型。

损失函数：Binary Cross Entropy（BCE，二元交叉熵），也称为 Log Loss 
$$
L=-\frac{1}{n}\sum_{i=1}^{n} [y_i\log(p_i)+(1-y_i)\log(1-p_i)]
$$
对于单个样本：

- 如果真实类别 y = 1，Loss = −log(p)
- 如果真实类别 y = 0，Loss = −log(1−p)

Logistic Regression 默认通常使用 L2 正则化.

| 对比           |              L1正则化              |         L2 Regularization          |
| -------------- | :--------------------------------: | :--------------------------------: |
|                | $L_{total}=BCE+\lambda\sum_j|w_j|$ | $L_{total}=BCE+\lambda\sum_jw_j^2$ |
| 作用           |         特征筛选、限制权重         |              限制权重              |
| 权重可能变成 0 |                 是                 |              通常不会              |
| 稀疏模型       |                 是                 |                 否                 |
| 适合场景       |            大量无关特征            |        多重共线性、一般任务        |

模型评估 Metrics:

- Confusion Matrix（混淆矩阵）：输出顺序为 [[TN, FP], [FN, TP]]

| 分类Metric    | 公式            | 含义                                     |
| ------------- | --------------- | ---------------------------------------- |
| **Accuracy**  | (TP+TN) / Total | **整体预测正确率**                       |
| **Precision** | TP / (TP+FP)    | **预测为正类**的样本中，有**多少是真**的 |
| **Recall**    | TP / (TP+FN)    | **真实正类**中，有**多少被找出来**       |
| **F1-score**  | 2PR / (P+R)     | Precision 和 Recall 的调和平均           |
| **ROC-AUC**   | ROC 曲线下面积  | 模型区分正负样本的能力                   |
| PR-AUC        | PR 曲线下面积   | 关注正类检索效果，适合不平衡任务         |

Threshold（分类阈值）：降低 Threshold -> Recall 提高或不变，Precision 通常可能下降。

项目应当在 Validation Set 上选择合适的 Threshold，而不是在 Test Set 上。调整 Threshold 不需重训模型。

```py
y_prob = model.predict_proba(X_test)[:, 1]
# Default threshold
y_pred = (y_prob >= 0.5).astype(int)

# Custom threshold
y_pred = (y_prob >= 0.3).astype(int)
```

> 默认情况下，分类阈值通常为 0.5，但实际业务中不一定合适.  
>
> | 业务场景     | 优先考虑     | 原因               |
> | ------------ | ------------ | ------------------ |
> | 癌症筛查     | Recall       | 尽量避免漏诊       |
> | 欺诈检测     | Recall       | 尽量找出欺诈交易   |
> | 垃圾邮件检测 | Precision    | 避免正常邮件被误判 |
> | 一般分类任务 | F1 / ROC-AUC | 综合评估模型能力   |

Imbalanced Data（数据不平衡）：数据不平衡时不能只看 Accuracy。

```py
model = LogisticRegression(
    class_weight="balanced",  # 给少数类别更高的训练权重
    max_iter=1000
)
```

| 其他常见方法 应对 数据不平衡 | 作用                 |
| ---------------------------- | -------------------- |
| Class Weight                 | 增加少数类的损失权重 |
| Oversampling                 | 增加少数类样本       |
| Undersampling                | 减少多数类样本       |
| SMOTE                        | 合成少数类样本       |
| Threshold Tuning             | 调整分类阈值         |
| PR-AUC / Average Precision   | 评估不平衡分类任务   |

```py
# 核心步骤
def sigmoid(z):
    return 1 / (1 + np.exp(-z))

p = sigmoid(X @ w + b)

error = p - y

dw = X.T @ error / n
db = np.mean(error)

w -= lr * dw
b -= lr * db

y_pred = (p >= 0.5).astype(int)  # 预测类别
```

```py
import numpy as np
# Training data
X = np.array([[1], [2], [3], [4], [5], [6]])
y = np.array([0, 0, 0, 1, 1, 1])

n_samples, n_features = X.shape

# Initialize parameters
w = np.zeros(n_features)
b = 0.0

lr = 0.1
epochs = 2000

def sigmoid(z):
    z = np.clip(z, -500, 500)  ''' np.clip 是为了提高数值稳定性，避免指数溢出和 log(0)'''
    return 1 / (1 + np.exp(-z))

for epoch in range(epochs):

    # 1. Prediction
    z = X @ w + b
    p = sigmoid(z)

    # 2. Binary Cross Entropy Loss （BCE，二元交叉熵），也称为 Log Loss
    loss = np.mean(np.logaddexp(0, z) - y * z)
    ''' np.logaddexp() 是为了提高数值稳定性，避免指数溢出和 log(0) '''

    # 3. Calculate gradients
    error = p - y
    dw = X.T @ error / n_samples
    db = np.mean(error)

    # 4. Update parameters
    w -= lr * dw
    b -= lr * db

# Predict new data
X_new = np.array([[2.5], [4.5]])

probabilities = sigmoid(X_new @ w + b)
predictions = (probabilities >= 0.5).astype(int)

print("Weight:", w)
print("Bias:", b)
print("Probabilities:", probabilities)
print("Predictions:", predictions)
```

实际项目使用：

```py
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    roc_auc_score
)

# 1. Load data
X, y = load_breast_cancer(return_X_y=True)

# 2. Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# 3. Build pipeline : 将数据预处理和模型训练封装在一起，避免预处理造成的数据泄漏
model = Pipeline([
    ("scaler", StandardScaler()),   # StandardScaler：特征标准化
    ("classifier", LogisticRegression(
        C=1.0,   # 正则化强度的倒数
        solver="lbfgs",  # 优化求解算法
        max_iter=1000,   # 	最大迭代次数
        penalty="l2",   # 正则化类型
        class_weight=None  # 类别权重
    ))
])
'''
# Strong regularization
model = LogisticRegression(C=0.01)

# Weak regularization
model = LogisticRegression(C=100)
'''
'''
Solver	    常用正则化	             特点
lbfgs	     L2	                    默认常用选择
liblinear	 L1、L2	               适合较小的二分类数据集
saga	     L1、L2、Elastic Net    适合较大数据集
sag        	 L2	                   适合较大数据集

实际项目可以先使用默认的 lbfgs，需要 L1 特征筛选时考虑 saga 或 liblinear
'''

# 4. Train
model.fit(X_train, y_train)

# 5. Predict class
y_pred = model.predict(X_test)  # 预测类别

# 6. Predict probability of class 1
y_prob = model.predict_proba(X_test)[:, 1]
''' 数据集的标签为 0 = 恶性、1 = 良性，因此 y_prob 表示预测为良性的概率 '''

# 7. Evaluate
print("Accuracy:", accuracy_score(y_test, y_pred))
print("ROC-AUC:", roc_auc_score(y_test, y_prob))
print(confusion_matrix(y_test, y_pred))
print(classification_report(y_test, y_pred))

```

```py
import joblib

# Save entire pipeline
joblib.dump(model, "logistic_regression.joblib")

# Load pipeline
loaded_model = joblib.load(
    "logistic_regression.joblib"
)

# Inference
X_new = X_test[:1]

prediction = loaded_model.predict(X_new)
probability = loaded_model.predict_proba(X_new)

print(prediction)
print(probability)
```

### **Ridge Regression & Lasso Regression**

Ridge 和 Lasso 并没有改变 Linear Regression 的预测公式，而是改变了 Loss Function，通过限制模型权重来减少 Overfitting。

- Ridge Regression：L2 Regularization
- Lasso Regression：L1 Regularization
- Elastic Net：L1 + L2 Regularization

任务：当数据存在噪声、特征过多或者特征之间高度相关时，模型可能出现权重过大、参数不稳定、Overfitting 等问题。

> 例如 数据集有 100 个特征，但真正有预测价值的可能只有其中一部分。Lasso 可以将部分特征权重变成 0。
>
> Lasso 将某个特征权重设为 0，并不代表这个特征在业务上一定没有价值，特别是存在高度相关特征时。

核心：在原来的 Loss Function 中增加一个惩罚项（Penalty Term）。 模型不再单纯追求训练误差最小，而是在预测准确性和模型复杂度之间寻找平衡
$$
Loss=Training\ Error+Regularization
$$

> Regularization 本质上是在处理 Bias 和 Variance 之间的权衡。
>
> 限制模型复杂度, 减少过拟合, 降低模型对训练数据噪声的敏感程度, 提高泛化能力.

Ridge Regression（L2 正则化）
$$
L=\frac{1}{n}\sum_{i=1}^{n}(y_i-\hat y_i)^2 +\lambda\sum_{j=1}^{d}w_j^2
$$

> 圆形约束区域，最优解通常不在坐标轴上，因此权重通常不为 0

Lasso (L1 正则化) 全称：Least Absolute Shrinkage and Selection Operator。
$$
L=\frac{1}{n}\sum_{i=1}^{n}(y_i-\hat y_i)^2 +\lambda\sum_{j=1}^{d}|w_j|
$$

> 不仅可以缩小权重，还可以让部分权重完全等于 0，从而实现 Feature Selection（特征选择）
>
> 菱形约束区域，最优解容易落在坐标轴的尖角上，使某个权重为 0

Elastic Net（L1 + L2）
$$
L=MSE+\lambda_1\sum_j|w_j| +\lambda_2\sum_jw_j^2
$$

```py
# Ridge Regression 核心步骤
error = X @ w + b - y

dw = 2 * X.T @ error / n
dw += 2 * alpha * w   # 与普通 Linear Regression 相比，只有梯度中增加了一项

db = 2 * np.mean(error)

w -= lr * dw
b -= lr * db
```

```py
# Lasso Regression 核心步骤 - Proximal Gradient Descent (每一步同时更新所有权重)
error = X @ w + b - y

dw = 2 * X.T @ error / n
db = 2 * np.mean(error)

w -= lr * dw
b -= lr * db

w = np.sign(w) * np.maximum(
    np.abs(w) - lr * alpha, 0
)  # Soft Thresholding
```

 sklearn 的 `Lasso` 默认使用的优化方法：Coordinate Descent（坐标下降法）- 固定其他权重，每次只优化一个权重。

实际项目调用：

```py
import numpy as np

from sklearn.datasets import load_diabetes
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

from sklearn.linear_model import (
    LinearRegression,
    Ridge,
    Lasso,
    ElasticNet
)

from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score
)

# 1. Load data
X, y = load_diabetes(return_X_y=True)

# 2. Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42
)

# 3. Define models
models = {
    "Linear": LinearRegression(),

    "Ridge": Ridge(alpha=1.0),  # Alpha 控制正则化的强度
    ''' Alpha 很大	正则化过强，可能欠拟合 '''

    "Lasso": Lasso(
        alpha=1.0,
        max_iter=10000
    ),

    "ElasticNet": ElasticNet(
        alpha=1.0,
        l1_ratio=0.5,  # l1_ratio越大,L1 / Lasso 混合权重 占比越大
        max_iter=10000
    )
}

# 4. Train and evaluate
for name, estimator in models.items():

    model = Pipeline([
        ("scaler", StandardScaler()), # 将不同特征转换到可比较的尺度
        ("regressor", estimator)
    ])

    model.fit(X_train, y_train)   # Train
    y_pred = model.predict(X_test)

    rmse = np.sqrt(
        mean_squared_error(y_test, y_pred)
    )

    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)

    weights = model["regressor"].coef_  # 获取权重

    print(name)
    print("RMSE:", rmse)
    print("MAE:", mae)
    print("R2:", r2)
    print("Weights:", weights)
    print("Non-zero features:", np.count_nonzero(weights))
    print("-" * 30)
```

> 即使 Ridge 和 Lasso 都设置 `alpha=1.0`，也不能认为它们的正则化强度完全相同。因为并不具有完全相同的数学缩放。

应该使用 Cross Validation 来选择 alpha：

```py
import numpy as np

from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import Ridge
from sklearn.model_selection import GridSearchCV

# 1. Pipeline
pipeline = Pipeline([
    ("scaler", StandardScaler()),
    ("regressor", Ridge())
])

# 2. Hyperparameter search space
param_grid = {
    "regressor__alpha": np.logspace(-4, 4, 30)
}

# 3. Cross validation
search = GridSearchCV(
    estimator=pipeline,
    param_grid=param_grid,
    cv=5,
    scoring="neg_root_mean_squared_error",
    n_jobs=-1
)

# 4. Search using training data only
search.fit(X_train, y_train)

# 5. Best model
best_model = search.best_estimator_

print("Best params:", search.best_params_)
print("CV RMSE:", -search.best_score_)

# 6. Final test
y_pred = best_model.predict(X_test)

print(
    "Test RMSE:",
    np.sqrt(mean_squared_error(y_test, y_pred))
)

```

```
Linear Regression 出现过拟合或权重不稳定
        |
        v
是否需要自动 Feature Selection？
        |
        +-- No --> Ridge Regression (L2)
        |          - 缩小权重
        |          - 保留特征
        |          - 缓解多重共线性
        |
        +-- Yes --> 特征之间是否高度相关？
                        |
                        +-- No --> Lasso Regression (L1)
                        |          - 缩小权重
                        |          - 部分权重变为 0
                        |          - 自动特征选择
                        |
                        +-- Yes --> Elastic Net (L1 + L2)
                                    - 自动特征选择
                                    - 稳定权重
                                    - 处理高度相关特征
```

### KNN (**K-Nearest Neighbors，K 近邻**)

KNN 不需要通过 Gradient Descent 学习权重，也没有需要优化的 w 和 b。它直接利用训练样本之间的距离进行预测。     **Lazy Learning（惰性学习）**，因为它将大量计算推迟到预测阶段。

> 后续理解 Similarity Search、Recommendation System、Vector Search

核心：距离相近的样本，往往具有相似的属性。

预测过程：

1. 计算新样本与所有训练样本的距离。
2. 找到距离最近的 K 个样本。
3. Classification：通过**多数投票决定类别**。
4. Regression：通过**平均值预测连续数值**。

Distance Metric（距离度量）：

- Euclidean Distance（欧氏距离）：最常用。 适合 数值型表格数据

  ```py
  distance = np.sqrt(np.sum((x - z) ** 2))
  ```

- Manhattan Distance（曼哈顿距离）： 适合 网格、部分高维数据。

  ```py
  distance = np.sum(np.abs(x - z))
  ```

- Minkowski Distance（闵可夫斯基距离）：前两种距离的统一形式。

- Cosine Similarity（余弦相似度）：在 NLP、Embedding、Recommendation、Vector Search 中常见：

  ```py
  similarity = np.dot(x, z) / (
      np.linalg.norm(x) * np.linalg.norm(z)
  )
  distance = 1 - similarity
  ```

- Hamming ：用于 二进制、离散特征

| K 值   | Bias     | Variance | 风险             |
| ------ | -------- | -------- | ---------------- |
| K 很小 | Low      | High     | Overfitting      |
| K 适中 | Balanced | Balanced | 泛化能力可能较好 |
| K 很大 | High     | Low      | Underfitting     |

使用 Cross Validation 寻找 K。

KNN 特别依赖 Feature Scaling：需要不同特征可以在可比较的尺度上计算距离。

KNN 最大的缺点之一是预测成本：训练数据达到百万级别时，每次预测都计算所有样本的距离，非常昂贵。

```py
# 没有必要对所有距离进行完整排序，只需要找到最小的 K 个距离
def knn_predict(X_train, y_train, x, k=5):
    distances = np.sum(
        (X_train - x) ** 2,
        axis=1
    )

    indices = np.argpartition(
        distances, k - 1
    )[:k]

    return Counter(
        y_train[indices]
    ).most_common(1)[0][0]
```

KNN 搜索算法：

- Brute Force：遍历所有训练样本，计算距离，选择最近邻。   适合 小数据集
- KD-Tree （K-Dimensional Tree）：按特征维度递归划分空间，通过剪枝跳过不可能包含最近邻的区域。
- Ball Tree：将数据组织成层级嵌套的球形区域，利用距离上下界进行剪枝。

```py
# Brute Force
model = KNeighborsClassifier(
    algorithm="brute"
)
'''
algorithm="kd_tree"   # 适合 低维数值数据
algorithm="ball_tree"  # 适合 有一定空间结构的数据
algorithm="auto"   # Automatically choose. 适合 一般 sklearn 项目,不保证选择最快方案
'''
```

**Curse of Dimensionality（维度灾难）**：随着特征维度增加，数据在高维空间中变得相对稀疏，需要更多样本才能覆盖特征空间。在一些常见数据分布下，最近距离与最远距离的相对差异变小。 => 最近邻的区分能力和树搜索的剪枝效率可能下降。

> KNN、K-means、PCA、向量检索等算法都会涉及。

| 解决Method        | 作用                       |
| ----------------- | -------------------------- |
| Feature Selection | 删除无关特征               |
| PCA               | 降低特征维度               |
| Metric Learning   | 学习更有效的距离度量       |
| Embedding         | 学习具有语义意义的向量表示 |
| ANN Search        | 降低大规模近邻搜索成本     |

>  ANN Search（Approximate Nearest Neighbor Search）主要解决搜索效率问题，并不会自动消除高维距离失去区分度的问题。
>
> ```PY
> from sklearn.decomposition import PCA
> 
> model = Pipeline([
>     ("scaler", StandardScaler()),
>     ("pca", PCA(n_components=0.95)), # 保留至少约 95% 的累计解释方差
>     ("classifier", KNeighborsClassifier(
>         n_neighbors=5
>     ))
> ])
> 
> model.fit(X_train, y_train)
> ```
>
> 



```py
# 核心步骤：Distance → Sort → Select K → Vote
distances = np.linalg.norm(X_train - x, axis=1)  # 每个样本的距离

indices = np.argsort(distances)[:k]  # 最近邻索引

labels = y_train[indices]  # 最近邻标签

prediction = Counter(labels).most_common(1)[0][0]
```

```py
# KNN Classification
import numpy as np
from collections import Counter

class KNN:

    def __init__(self, k=3):
        self.k = k

    def fit(self, X, y):
        # Store training data
        self.X_train = np.asarray(X, dtype=float)
        self.y_train = np.asarray(y)
        return self

    def _predict(self, x):

        # 1. Calculate Euclidean distances
        distances = np.sqrt(
            np.sum((self.X_train - x) ** 2, axis=1)
        )
        ''' X_train - x : Broadcasting 同时计算新样本与所有训练样本的特征差值'''

        # 2. Find K nearest neighbors
        k_indices = np.argsort(distances)[:self.k]

        # 3. Get neighbor labels
        k_labels = self.y_train[k_indices]

        # 4. Majority voting
        prediction = Counter(
            k_labels
        ).most_common(1)[0][0]

        return prediction

    def predict(self, X):
        return np.array([
            self._predict(x) for x in X
        ])


# Training data
X_train = np.array([
    [1, 1],
    [2, 1],
    [1, 2],
    [5, 5],
    [6, 5],
    [5, 6]
])

y_train = np.array([0, 0, 0, 1, 1, 1])

# Train
model = KNN(k=3)
model.fit(X_train, y_train)

# Predict
X_test = np.array([
    [2, 2],
    [6, 6]
])

print(model.predict(X_test))

# 分类使用 Majority Voting，回归使用 Mean
def knn_regression(X_train, y_train, x, k=3):
    distances = np.linalg.norm(
        X_train - x, axis=1
    )

    indices = np.argsort(distances)[:k]

    return np.mean(y_train[indices])
```

实际项目调用：

```py
# KNN Classification
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier
from sklearn.pipeline import Pipeline

from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    roc_auc_score
)

# 1. Load data
X, y = load_breast_cancer(return_X_y=True) # sklearn 自带的 Breast Cancer 数据集

# 2. Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# 3. Build pipeline
model = Pipeline([
    ("scaler", StandardScaler()),  # Feature Scaling

    ("classifier", KNeighborsClassifier( 
        n_neighbors=5,        # 最近邻数量 K
        weights="uniform",    # 邻居投票权重: 每个邻居的投票权重相同
        metric="minkowski",   # 距离计算方式
        p=2,      # Minkowski 距离参数 (p=1:Manhattan Distance ; p=2:Euclidean)
        n_jobs=-1             # 并行计算任务数
    ))  # KNN 分类模型
])
 
''' Distance Weighted KNN 中，距离越近的邻居，投票权重越大
model = KNeighborsClassifier(
    n_neighbors=5,
    weights="distance"
)
'''

''' KNN Regression:
model = Pipeline([
    ("scaler", StandardScaler()),
    ("regressor", KNeighborsRegressor(
        n_neighbors=5,
        weights="distance"
    ))
])
'''

# 4. Train
model.fit(X_train, y_train)

# 5. Predict
y_pred = model.predict(X_test)
y_prob = model.predict_proba(X_test)[:, 1]

# 6. Evaluate
print("Accuracy:", accuracy_score(y_test, y_pred))
print("ROC-AUC:", roc_auc_score(y_test, y_prob))
print(confusion_matrix(y_test, y_pred))
print(classification_report(y_test, y_pred))

'''  kneighbors() 在相似样本检索、推荐系统等任务中 应用
from sklearn.neighbors import NearestNeighbors

model = NearestNeighbors(n_neighbors=3) # 只负责搜索最近邻，不需要 y，也不负责分类或回归
model.fit(X_train)
distances, indices = model.kneighbors(X_test[:1])  # 获取最近邻距离和索引

print(distances)
print(indices)
'''
```



 Naive Bayes 概率分类 Decision Tree 决策树 分类与回归 SVM/ SVR 最大间隔分类与回归





## 集成学习 Ensemble Learning

Bagging 并行集成 Random Forest 随机森林 多棵随机化决策树 Extra Trees 随机化树集成 AdaBoost 自适应提升 GBDT 梯度提升决策树 XGBoost 高性能梯度提升

LightGBM 高效梯度提升 CatBoost 类别特征处理 Stacking / Blending 多模型融合







## 无监督学习 Unsupervised Learning

K-means 聚类 Hierarchical Clustering 层次聚类 DBSCAN 密度聚类 HDBSCAN 层次密度聚类 GMM 高斯混合模型 概率聚类

EM Algorithm 隐变量参数估计 PCA 线性降维, 去噪 SVD 矩阵分解 t-SNE 高维数据可视化 UMAP 非线性降维 Isolation Forest 异常检测 One-Class SVM 异常检测



## 概率模型与序列模型

Markov Chain 马尔可夫链 HMM 隐马尔可夫模型 CRF 条件随机场, 序列标注 Bayesian Network 概率图模型 Kalman Filter 动态状态估计 Gaussian Process 概率回归
