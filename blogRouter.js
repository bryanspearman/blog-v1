const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const { BlogPosts } = require('./models');


BlogPosts.create(
        'A Test Blog Post #1', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione facilis error dolores explicabo animi, porro aperiam vitae eveniet aspernatur nam sit consectetur doloremque non alias exercitationem quam est! Molestiae, ipsum!' + 
        'Praesentium ad laudantium unde est quia saepe ea repudiandae! Dolorum pariatur temporibus nisi hic obcaecati eos! Hic ipsam, sapiente distinctio animi consequuntur autem.Consectetur architecto ea animi blanditiis, ex unde.' +
        'Eius, voluptatibus.Sequi tenetur aspernatur non, asperiores reprehenderit eius, quia dolore autem architecto explicabo similique doloremque ipsam ipsa aliquam distinctio dolorem error quos soluta cum quisquam sint perferendis.Laudantium, ullam?', 'Bryan Spearman', Date.now());
BlogPosts.create(
        'TEST Blog Post #2', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione facilis error dolores explicabo animi, porro aperiam vitae eveniet aspernatur nam sit consectetur doloremque non alias exercitationem quam est! Molestiae, ipsum!' +
        'Praesentium ad laudantium unde est quia saepe ea repudiandae! Dolorum pariatur temporibus nisi hic obcaecati eos! Hic ipsam, sapiente distinctio animi consequuntur autem.Consectetur architecto ea animi blanditiis, ex unde.' +
        'Eius, voluptatibus.Sequi tenetur aspernatur non, asperiores reprehenderit eius, quia dolore autem architecto explicabo similique doloremque ipsam ipsa aliquam distinctio dolorem error quos soluta cum quisquam sint perferendis.Laudantium, ullam?', 'Bryan Spearman', Date.now());


router.get('/', (req, res) => {
    res.json(BlogPosts.get());
});


router.post('/', jsonParser, (req, res) => {
     const requiredFields = ['title', 'content', 'author'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    const item = BlogPosts.create(req.body.title, req.body.content, req.body.author);
    res.status(201).json(item);
});


router.delete('/:id', (req, res) => {
    BlogPosts.delete(req.params.id);
    console.log(`Deleted blog post \`${req.params.ID}\``);
    res.status(204).end();
});


router.put('/:id', jsonParser, (req, res) => {
    const requiredFields = ['title', 'content', 'id'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    if (req.params.id !== req.body.id) {
        const message = (
            `Request path id (${req.params.id}) and request body id `
                `(${req.body.id}) must match`);
        console.error(message);
        return res.status(400).send(message);
    }
    console.log(`Updating blog post \`${req.params.id}\``);
    const updatedItem = BlogPosts.update({
        id: req.params.id,
        title: req.body.title,
        content: req.body.content
    });
    res.status(204).end();
})

module.exports = router;