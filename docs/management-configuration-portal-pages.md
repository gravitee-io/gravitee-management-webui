# Portal pages

Currently, we support four types of documentation:

* Swagger/OpenApi.
* Markdown (MD).
* AsciiDoc.
* AsyncApi.

By default, portal pages are in staging mode and will be visible to administrators and users with management portal roles.

To make documentation visible for all users, you can switch on the *published* button.
Portal pages will be accessible from the *DOCUMENTATION* main section.

You can set the *homepage* by clicking on the *house* button. The portal homepage will be visible in the portal landing page.

You can also configure a page by clicking on the *settings* button. Within this section, the page will fetch and pull in content from an external resource such as Git repositories, or HTTP urls.

To create a new page of documentation, click the (+) button.

You can also add an entire directory. Click on the link at the top of the screen to import a directory.
If this directory contains a gravitee descriptor (a file named `.gravitee.json`), we will add the content according to the descriptor.

Here is a descriptor sample:
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
