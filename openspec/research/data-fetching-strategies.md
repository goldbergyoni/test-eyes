# Research: Data Fetching Strategies

## 1. Can we avoid bundling data with frontend?

### Current Approach
Data is copied into `apps/frontend/dist/data/` during build, then deployed together.

### Alternatives

#### Option A: Fetch from GitHub Raw Content
```js
const dataUrl = `https://raw.githubusercontent.com/${owner}/${repo}/gh-data/data/main-test-data.json`
const res = await fetch(dataUrl)
```

**Pros:**
- No bundling needed
- Data always fresh from gh-data branch
- Smaller deploy artifact

**Cons:**
- CORS issues with private repos
- Rate limiting (60 req/hour unauthenticated)
- Slower initial load (extra network hop)

#### Option B: GitHub API
```js
const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/data/main-test-data.json?ref=gh-data`
const res = await fetch(apiUrl, { headers: { Authorization: `token ${token}` }})
const data = JSON.parse(atob(res.content))
```

**Pros:**
- Works with private repos (with token)
- Proper API with versioning

**Cons:**
- Requires authentication for private repos
- Rate limiting (5000 req/hour with token)
- Base64 decoding overhead

#### Option C: GitHub Pages serves data separately
Keep current approach but trigger data-only deploys more frequently.

**Recommendation:** Keep bundling for MVP. It's simple and works. Consider Option A for public repos later.

---

## 2. Can user inject a token for private branch access?

### Approach: URL Parameter Token
```js
const urlParams = new URLSearchParams(window.location.search)
const token = urlParams.get('token')

if (token) {
  // Fetch from GitHub API with auth
  fetch(apiUrl, { headers: { Authorization: `Bearer ${token}` }})
} else {
  // Fetch from bundled data
  fetch('/data/main-test-data.json')
}
```

**URL:** `https://org.github.io/test-eyes/?token=ghp_xxxx`

### Security Considerations
- **Risk:** Token in URL is logged in browser history, server logs, referrer headers
- **Mitigation:** Use short-lived tokens, read-only scope
- **Better:** Use `sessionStorage` - user pastes token once, stored for session

### Alternative: LocalStorage Token Input
```jsx
function TokenInput() {
  const [token, setToken] = useState(localStorage.getItem('gh-token'))

  return token ? <Dashboard token={token} /> : (
    <input
      type="password"
      placeholder="GitHub token"
      onBlur={(e) => {
        localStorage.setItem('gh-token', e.target.value)
        setToken(e.target.value)
      }}
    />
  )
}
```

**Recommendation:** Implement localStorage token input for private repos. Simple, secure enough for internal tools.

---

## 3. How can we solve stale data?

### Problem
Dashboard shows data from last aggregation. If PRs run but aggregation hasn't triggered, data is stale.

### Solutions

#### A: More Frequent Aggregation
Change cron from every 6 hours to every hour:
```yaml
schedule:
  - cron: '0 * * * *'  # Every hour
```

**Pros:** Simple
**Cons:** More GitHub Actions minutes, still up to 1 hour stale

#### B: Show Staleness Indicator
```jsx
const lastUpdated = new Date(meta.lastAggregatedAt)
const hoursAgo = (Date.now() - lastUpdated) / 1000 / 60 / 60

{hoursAgo > 1 && (
  <span className="text-yellow-500">
    Data may be stale ({Math.floor(hoursAgo)}h old)
  </span>
)}
```

**Pros:** User knows to expect delays
**Cons:** Doesn't fix the problem

#### C: Trigger Aggregation on PR Merge
Add to PR merge workflow:
```yaml
on:
  pull_request:
    types: [closed]
    branches: [main]

jobs:
  aggregate-if-merged:
    if: github.event.pull_request.merged == true
    steps:
      - run: gh workflow run aggregate-and-deploy.yml
```

**Pros:** Data updates shortly after merge
**Cons:** More workflow runs

#### D: Client-Side Polling (Advanced)
```js
useEffect(() => {
  const interval = setInterval(async () => {
    const res = await fetch('/data/main-test-data.json')
    const newData = await res.json()
    if (newData.meta.lastAggregatedAt !== data.meta.lastAggregatedAt) {
      setData(newData)
    }
  }, 60000) // Check every minute

  return () => clearInterval(interval)
}, [])
```

**Pros:** Auto-refresh when new data available
**Cons:** Only works if data is re-deployed

### Recommendation
1. **Short-term:** Add staleness indicator (Option B) - quick win
2. **Medium-term:** Trigger aggregation on PR merge (Option C)
3. **Long-term:** Consider more frequent cron if needed

---

## Summary

| Question | Recommendation | Effort |
|----------|---------------|--------|
| Avoid bundling? | Keep bundling for MVP | - |
| Token injection? | LocalStorage input for private repos | Medium |
| Stale data? | Staleness indicator + PR merge trigger | Low-Medium |
