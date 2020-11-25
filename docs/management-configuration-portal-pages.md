# Portal pages

At this date, two types of document are supported :

- Swagger
- Markdown (MD)

By default, portal pages are in staging mode and will be visible to administrator or users with management portal roles.
To make documentation visible for all users, you can switch on the _published_ button.
Portal pages will be accessible from the _DOCUMENTATION_ main section.

You can set a page to be a _homepage_ by clicking on the _house_ button. Portal homepage will be visible in the Portal landing page.

You can also configure a page by clicking on the _settings_ button. Page's configuration let you fetch page's content from an external resource such as Git repositories, or HTTP urls.

(+) button let you create a new documentation page.

Another possibility is to add a whole directory. Click on the link at the top of the screen and import a directory.
If this directory contains a gravitee descriptor (a file named `.gravitee.json`) we will add the content according to the descriptor.

Here is a descriptor sample :

```json
{
  "version": 1,
  "documentation": {
    "pages": [
      {
        "src": "/docs/readme.md",
        "dest": "/my/new/dir/",
        "name": "Homepage",
        "homepage": true
      },
      {
        "src": "/docs/doc2.md",
        "dest": "/my/new/dir/",
        "name": "Business"
      }
    ]
  }
}
```
