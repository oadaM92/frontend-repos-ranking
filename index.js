var https = require('https');
var fs = require('fs');

var options = {
    protocol: 'https:',
    host: 'api.github.com',
    path: '/search/repositories?q=language:javascript+language:css+language:html+stars:>=10000&sort=stars&order=desc&per_page=100',
    method: 'GET',
    headers: {
        'User-Agent': 'frontend-repos-ranking',
    }
};

var getRepos = new Promise(function(resolve, reject) {
    var req = https.request(options, (res) => {
        var data = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            resolve(data);
        })
    });

    req.on('error', (e) => {
        console.log(`problem with request: ${e.message}`);
    });

    req.end();
});

getRepos.then((repos) => {
    var markdown = 
`# frontend-repos-ranking
## ${(new Date()).toDateString()}
github上所有前端项目（HTML+CSS+JavaScript）的总排名！
本页面使用nodejs结合github的api自动生成，您可以通过运行\`node index.js\`来生成最新的排行榜。\n\n`;

    markdown += ' Rank | Name(Description) | Star | Language | Created_At \n';

    markdown += ' --- | --- | --- | --- | --- \n';

    repos = JSON.parse(repos);

    repos.items.forEach((item, index) => {

        markdown += `${index+1}|[**${item.full_name}**](${item.html_url})<br><br>${item.description}|${item.stargazers_count}|${item.language}|${item.created_at.split('T')[0]}\n`;

    });

    fs.writeFile('README.md', markdown);
});