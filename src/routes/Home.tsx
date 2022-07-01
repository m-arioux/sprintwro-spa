import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled, useTheme } from "@mui/material/styles";
import { Button, Container, IconButton, TextField } from "@mui/material";
import { Casino, Shuffle } from "@mui/icons-material";

const Item = styled(Paper)(({ theme }) => ({
  //  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
}));

export enum Action {
  CreateRoom,
  JoinRoom,
}

export interface Form {
  username?: string;
  newRoomName?: string;
  existingRoomName?: string;
}

const formDefaultValues: Form = {
  username: "",
  existingRoomName: "",
  newRoomName: "",
};

export interface IHomeProps {}

export function Home(props: IHomeProps) {
  const theme = useTheme();

  const [formValues, setFormValues] = React.useState(formDefaultValues);
  const [formErrors, setFormErrors] = React.useState({
    username: false,
    existingRoomName: false,
    newRoomName: false,
  });

  const addFormErrors = (key: keyof Form) => {
    setFormErrors({ ...formErrors, [key]: true });
  };

  const handleInputChange = (
    e: React.ChangeEvent<{ name: string; value: string }>
  ) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = (action: Action) => {
    console.log("submitted value: ", formValues);
    setFormErrors({
      username: false,
      existingRoomName: false,
      newRoomName: false,
    });

    const isEmpty = (value: string | undefined) => value?.trim().length === 0;

    const { username, newRoomName, existingRoomName } = formValues;

    if (isEmpty(username)) addFormErrors("username");

    if (action === Action.CreateRoom) {
      if (isEmpty(newRoomName)) addFormErrors("newRoomName");
    } else {
      if (isEmpty(existingRoomName)) addFormErrors("existingRoomName");
    }

    console.log("errors", formErrors);

    if (
      !Object.values(formErrors).reduce(
        (previous, current) => previous || current
      )
    ) {
      alert("no errors");
    }
  };

  const generateRandomUsername = () => {
    fetch("https://random-data-api.com/api/users/random_user").then(
      (response) => {
        response.json().then((json) => {
          setFormValues({
            ...formValues,
            username: json.username,
          });
        });
      }
    );
  };

  return (
    <main>
      <h2>Welcome to the best sprint review tool!</h2>
      <Container style={{ textAlign: "center" }}>
        <Stack
          spacing={2}
          sx={{ maxWidth: "400px" }}
          style={{ marginLeft: "auto", marginRight: "auto" }}
        >
          <form>
            <p>First of all, choose a username: </p>
            <Item style={{ backgroundColor: theme.palette.warning.light }}>
              <Stack direction="row">
                <TextField
                  id="username"
                  name="username"
                  label="Username"
                  color="warning"
                  value={formValues.username}
                  onChange={handleInputChange}
                  style={{ flexGrow: 1 }}
                  error={formErrors.username}
                />
                <IconButton color="warning" onClick={generateRandomUsername}>
                  <Casino />
                </IconButton>
              </Stack>
            </Item>
            <p>Then, you can either:</p>
            <Item style={{ backgroundColor: theme.palette.primary.light }}>
              <h3 style={{ color: "white" }}>Create a room</h3>

              <Stack spacing={2}>
                <TextField
                  id="newRoomName"
                  name="newRoomName"
                  label="Room name"
                  value={formValues.newRoomName}
                  onChange={handleInputChange}
                  error={formErrors.newRoomName}
                />
                <Button
                  variant="contained"
                  onClick={() => handleSubmit(Action.CreateRoom)}
                >
                  Submit
                </Button>
              </Stack>
            </Item>
            <p> - or - </p>
            <Item style={{ backgroundColor: theme.palette.secondary.light }}>
              <h3 style={{ color: "white" }}>Join an existing room</h3>

              <Stack spacing={2}>
                <TextField
                  id="existingRoomName"
                  name="existingRoomName"
                  label="Room code"
                  color="secondary"
                  value={formValues.existingRoomName}
                  onChange={handleInputChange}
                  error={formErrors.existingRoomName}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleSubmit(Action.JoinRoom)}
                >
                  Submit
                </Button>
              </Stack>
            </Item>
          </form>
        </Stack>
      </Container>
    </main>
  );
}
