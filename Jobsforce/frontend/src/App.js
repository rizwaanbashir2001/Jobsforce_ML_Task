import React, { useState } from "react";
import { Container, Typography, TextField, Button, Grid, Box } from "@mui/material";

function App() {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        role: "",
    });

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("pdf", file);

        const response = await fetch("http://35.154.240.63:5000/extract", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        setFormData({
            name: data.Name || "",
            phone: data.Phone || "",
            address: data.Address || "",
            role: data.Role || "",
        });
    };

    return (
        <Container maxWidth="sm" style={{ paddingTop: "40px" }}>
            <Typography variant="h4" gutterBottom align="center">
                PDF Data Extractor
            </Typography>
            
            <Box sx={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                <Button variant="contained" component="label">
                    Upload PDF
                    <input type="file" hidden onChange={handleFileUpload} />
                </Button>
            </Box>
            
            <form>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Name"
                            fullWidth
                            value={formData.name}
                            InputProps={{
                                readOnly: true,
                            }}
                            variant="outlined"
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label="Phone"
                            fullWidth
                            value={formData.phone}
                            InputProps={{
                                readOnly: true,
                            }}
                            variant="outlined"
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label="Address"
                            fullWidth
                            value={formData.address}
                            InputProps={{
                                readOnly: true,
                            }}
                            variant="outlined"
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label="Role"
                            fullWidth
                            value={formData.role}
                            InputProps={{
                                readOnly: true,
                            }}
                            variant="outlined"
                        />
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
}

export default App;

