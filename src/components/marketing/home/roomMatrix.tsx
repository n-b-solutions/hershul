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

interface Asset {
    name: string;
    active: boolean;
}
interface AssetCollection {
    nameRoom: string;
    assets: Asset[];
}
const initialAssetCollection: AssetCollection[] = [
    {
        nameRoom: 'room1',
        assets: [
            { name: "on", active: true },
            { name: "off", active: false },
            { name: "blur", active: false },
        ]
    },
    {
        nameRoom: 'room2',
        assets: [
            { name: "on", active: true },
            { name: "off", active: false },
            { name: "blur", active: false },
        ]
    },
    {
        nameRoom: 'room3',
        assets: [
            { name: "on", active: true },
            { name: "off", active: false },
            { name: "blur", active: false },
        ]
    },
    {
        nameRoom: 'room4',
        assets: [
            { name: "on", active: true },
            { name: "off", active: false },
            { name: "blur", active: false },
        ]
    },
];

export function RoomMatrix(): React.JSX.Element {
    const [assetsState, setAssetsState] = React.useState<AssetCollection[]>(initialAssetCollection);

    const handleStatusChange = (roomId: string, assetName: string) => {
        setAssetsState((prevState) =>
            prevState.map((asset) =>
                asset.nameRoom === roomId
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
