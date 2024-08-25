import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { SpeakerSimpleHigh as SpeakerIcon } from '@phosphor-icons/react/dist/ssr/SpeakerSimpleHigh';
import { Gear as SettingsIcon } from '@phosphor-icons/react/dist/ssr/Gear';
import axios from 'axios';

interface Asset {
    name: string;
    active: boolean;
}
interface AssetCollection {
    nameRoom: string;
    assets: Asset[];
}

const API_BASE_URL =import.meta.env.VITE_LOCAL_SERVER;

export function RoomMatrix(): React.JSX.Element {
    const [assetsState, setAssetsState] = React.useState<AssetCollection[]>([]);
    React.useEffect(() => {
        axios.get(`${API_BASE_URL}/roomStatus`)
            .then(res => {
                setAssetsState(res.data);
            })
            .catch(err => {
                console.error("Error fetching data:", err);
            });
    }, []);
    const handleStatusChange = (nameRoom: string, assetName: string) => {
        setAssetsState((prevState) =>
            prevState.map((asset) =>
                asset.nameRoom === nameRoom
                    ? {
                        ...asset,
                        assets: asset.assets.map((ass) =>
                            ass.name === assetName
                                ? { ...ass, active: true }
                                : { ...ass, active: false }
                        ),
                    }
                    : asset
            )
        );
    };

    return (
        <Box sx={{ height: '90vh', display: 'flex', flexDirection: 'column', p: 4 }}>
            <Grid container spacing={3} sx={{ flex: 1, overflow: 'auto' }}>
                {assetsState.map((asset) => (
                    <Grid key={asset.nameRoom} xs={12} sm={12} md={6} lg={6}>
                        <Card>
                            <Box
                                sx={{
                                    alignItems: 'center',
                                    display: 'flex',
                                    height: '70px',
                                    justifyContent: 'center',
                                }}
                            >
                                <Typography noWrap variant="subtitle2">
                                    {asset.nameRoom}
                                </Typography>
                            </Box>
                            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                                {asset.assets.map((ass) => (
                                    <Button
                                        key={ass.name}
                                        variant={ass.active ? "contained" : "outlined"}
                                        sx={{ margin: '5px' }}
                                        onClick={() => handleStatusChange(asset.nameRoom, ass.name)}
                                    >
                                        {ass.name}
                                    </Button>
                                ))}
                            </CardContent>
                            <Divider />
                            <CardActions sx={{ justifyContent: 'center' }}>
                                <IconButton color="secondary" size="small">
                                    <SpeakerIcon />
                                </IconButton>
                                <IconButton color="secondary" size="small">
                                    <SettingsIcon />
                                </IconButton>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

        </Box>
    );
}
