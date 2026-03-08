const API_URL = "https://phi-lab-server.vercel.app/api/v1/lab";
let allIssues = [];


async function fetchIssues(status = 'all') {
    document.getElementById('loader').classList.remove('hidden');
    document.getElementById('issue-grid').innerHTML = '';  

    let url = `${API_URL}/issues`;
    if (status !== 'all') {
        url += `?status=${status}`;
    }

    try {
        const res = await fetch(url);
        const result = await res.json();
        
        allIssues = result.data || result; 

        if (Array.isArray(allIssues)) {
            renderIssues(allIssues);
        } else {
            console.error("API did not return an array:", result);
        }
    } catch (err) {
        console.error("Data Load Error:", err);
    } finally {
        document.getElementById('loader').classList.add('hidden');
    }
}