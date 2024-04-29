import { Hono } from "hono";
import type { FC } from "hono/jsx";
import {
  Contact,
  deleteContactById,
  editContact,
  getAllContacts,
  getContactById,
} from "./db";
import { serveStatic } from "hono/bun";

const app = new Hono();

app.use("/static/*", serveStatic({ root: "./" }));

const Layout: FC = ({ children }) => {
  return (
    <html>
      <head>
        <link rel="stylesheet" href="/static/styles.css" />
        <script
          src="https://unpkg.com/htmx.org@1.9.12"
          integrity="sha384-ujb1lZYygJmzgSwoxRggbCHcjc0rB2XoQrxeTUQyRjrOnlCoYta87iKBWq3EsdM2"
          crossorigin="anonymous"
        ></script>
      </head>

      <body>{children}</body>
    </html>
  );
};

const ContactTable: FC<{ contacts: Contact[] }> = (props: {
  contacts: Contact[];
}) => {
  return (
    <Layout>
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          {props.contacts.map((contact, index) => (
            <tr key={index}>
              <td>{contact.firstName}</td>
              <td>{contact.lastName}</td>
              <td>{contact.email}</td>
              <td>{contact.phone}</td>
              <td>
                <button
                  type="button"
                  hx-delete={`/contacts/${contact.id}`}
                  hx-confirm="Are you sure you want to delete this contact?"
                  hx-swap="outerHTML swap:1s"
                  hx-target="closest tr"
                >
                  Delete
                </button>
                <a href={`/contacts/${contact.id}/edit`}>Edit</a>
                <a href={`/contacts/${contact.id}`}>View</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
};

const EditForm: FC<{ contact: Contact }> = ({ contact }) => (
  <Layout>
    <form>
      <label>
        First Name:
        <input type="text" name="firstName" value={contact.firstName || ""} />
      </label>
      <label>
        Last Name:
        <input type="text" name="lastName" value={contact.lastName || ""} />
      </label>
      <label>
        Email:
        <input type="text" name="email" value={contact.email || ""} />
      </label>
      <label>
        Phone:
        <input type="text" name="phone" value={contact.phone || ""} />
      </label>
      <button type="button" hx-put={`/contacts/${contact.id}`} hx-swap="none">
        Update
      </button>
    </form>
    <div>
      <a href={`/`}>Back</a>
    </div>
  </Layout>
);

const ViewContact: FC<{ contact: Contact }> = ({ contact }) => (
  <Layout>
    <div>
      <h1>Contact Details</h1>
      <p>First Name: {contact.firstName}</p>
      <p>Last Name: {contact.lastName}</p>
      <p>Email: {contact.email}</p>
      <p>Phone: {contact.phone}</p>
    </div>
    <div>
      <a href={`/contacts/${contact.id}/edit`}>Edit</a>
      <a href="/">Back</a>
    </div>
  </Layout>
);

app.get("/contacts/:id/edit", async (c) => {
  const id = c.req.param("id");
  const contact = await getContactById(+id);
  if (!contact) {
    return c.html(<h1>Contact not found</h1>);
  }

  return c.html(<EditForm contact={contact} />);
});

app.delete("/contacts/:id", async (c) => {
  const id = c.req.param("id");
  await deleteContactById(+id);
  return c.body(null);
});

app.get("/contacts/:id", async (c) => {
  const id = c.req.param("id");
  const contact = await getContactById(+id);
  if (!contact) {
    return c.html(<h1>Contact not found</h1>);
  }
  return c.html(<ViewContact contact={contact} />);
});

app.put("/contacts/:id", async (c) => {
  const id = c.req.param("id");
  const updatedContact = await c.req.parseBody<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  }>();
  await editContact(+id, updatedContact);
  c.header("HX-Redirect", `/`);
  return c.body(null);
});

app.get("/", async (c) => {
  const contacts = await getAllContacts();
  return c.html(
    <Layout>
      <ContactTable contacts={contacts} />
    </Layout>,
  );
});

export default app;
