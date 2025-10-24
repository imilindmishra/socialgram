

---

# 🧭 plan.md — AWS EC2 + k6 Load Testing Task

## 🎯 **Objective**

Perform **load testing** on a backend API deployed inside an AWS EC2 instance using **k6**.
The goal is to determine the **Requests Per Second (RPS)** that the API can handle under specific **P95 latency constraints** (i.e., 95% of requests should complete within a given time threshold).

---

## 🧩 **Context Summary**

* The EC2 instance is already **running** and accessible.
* The **developer’s SSH key** has been added to the instance.
* Instance details:

  * **Instance ID:** `i-0b4b15a0ef001bcfc`
  * **Region:** `ap-south-1 (Mumbai)`
  * **Type:** `t3.medium`
  * **Public IPv4:** `13.203.92.70` *(may change if instance restarts)*
  * **Default SSH user:** `ubuntu`
* The instance may **shut down at 9 PM**, so complete testing before that.

---

## 🧠 **High-Level Goal**

1. **SSH into** the EC2 instance (remote Ubuntu server).
2. **Install k6**, the load testing tool.
3. **Run performance tests** on one of the backend APIs (e.g., `/api/posts` or `/api/health`).
4. **Measure key metrics**:

   * RPS (Requests per Second)
   * P95 response time (latency)
   * Error rate
5. **Generate a performance report** and share results.

---

## 🪜 **Step-by-Step Instructions**

### **Step 1: SSH into the EC2 Instance**

Run this command in the terminal:

```bash
ssh -i ~/.ssh/id_ed25519 ubuntu@13.203.92.70
```

> Notes:
>
> * `~/.ssh/id_ed25519` is your private key file.
> * The IP might change if the instance restarts — check the AWS Console for the new one.
> * Once connected, your terminal prompt should look like:
>   `ubuntu@ip-172-31-19-251:~$`

---

### **Step 2: Verify Connectivity to the Backend API**

Inside the instance, check if your API is up:

```bash
curl http://localhost:4000/api/health
```

or, if hosted externally:

```bash
curl https://your-api-endpoint.com/api/health
```

Expected output: a small JSON response like `{ "ok": true }`.

---

### **Step 3: Install k6**

Run the following commands to install `k6`:

```bash
sudo apt update
sudo apt install -y gnupg software-properties-common
curl -s https://dl.k6.io/key.gpg | sudo gpg --dearmor -o /usr/share/keyrings/k6-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt update
sudo apt install -y k6
```

Check installation:

```bash
k6 version
```

---

### **Step 4: Create a Load Test Script**

Create a file named `test.js`:

```js
import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 10,              // Number of concurrent virtual users
  duration: '30s',      // How long to run the test
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete under 500ms
  },
};

export default function () {
  const res = http.get('https://your-api-endpoint.com/api/posts');
  check(res, { 'status was 200': (r) => r.status === 200 });
  sleep(1);
}
```

> Replace `https://your-api-endpoint.com/api/posts` with the real API you’re testing.

---

### **Step 5: Run the Load Test**

Execute:

```bash
k6 run test.js
```

Observe metrics such as:

* RPS (requests per second)
* Avg / P95 latency
* Success rate

---

### **Step 6: Generate Reports**

To export results:

```bash
k6 run --out json=results.json test.js
```

or for a quick HTML report:

```bash
k6 run --out html=report.html test.js
```

Copy results to your local machine:

```bash
scp -i ~/.ssh/id_ed25519 ubuntu@13.203.92.70:~/results.json .
```

---

### **Step 7: Summarize Findings**

Prepare a short table summarizing test results:

| Metric            | Value        | Comment         |
| ----------------- | ------------ | --------------- |
| Avg Response Time | 350 ms       | Good            |
| P95 Response Time | 480 ms       | ✅ within target |
| RPS               | 10.5 req/sec | Target met      |
| Error Rate        | 0%           | ✅ Stable        |
| Instance Type     | t3.medium    |                 |

---

## 📦 **Expected Deliverables**

* `test.js` — your k6 test script
* `results.json` or `report.html` — k6 output
* Summary table (as above)

---

## 🧾 **Additional Notes**

* The instance **shuts down at 9 PM**, so complete the task before that.
* If restarted, you’ll need to **start the instance manually** (Developer role required).
* Always confirm the **latest public IP** from the AWS EC2 console before SSH.

---

## ✅ **End Goal Recap**

> **Goal:** Determine how many requests per second (RPS) your API can handle while keeping the 95th percentile (P95) latency under the defined threshold (e.g., 500ms).

---

