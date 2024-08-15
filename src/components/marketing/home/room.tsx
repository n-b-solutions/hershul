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
    id: string;
    mimeType: string;
    name: string;
    size: string;
    url: string;
    status: 'on' | 'off' | 'blur';
}

const initialAssets: Asset[] = [
    {
        id: 'ASSET-003',
        mimeType: 'image/png',
        name: 'example-project1.png',
        size: '3 MB',
        url: '/assets/image-abstract-2.png',
        status: 'on'
    },
    {
        id: 'ASSET-002',
        mimeType: 'application/zip',
        name: 'docs.zip',
        size: '6.2 MB',
        url: '#',
        status: 'blur'
    },
    {
        id: 'ASSET-001',
        mimeType: 'image/png',
        name: 'example-project2.png',
        size: '3.2 MB',
        url: '/assets/image-minimal-2.png',
        status: 'off'
    },
];

export function Room(): React.JSX.Element {
    const [assetsState, setAssetsState] = React.useState<Asset[]>(initialAssets);

    const handleStatusChange = (id: string, newStatus: 'on' | 'off' | 'blur') => {
        setAssetsState((prevState) =>
            prevState.map((asset) =>
                asset.id === id ? { ...asset, status: newStatus } : asset
            )
        );
    };

    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
                {assetsState.map((asset) => (
                    <Grid key={asset.id} xs={12} sm={6}>
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
                                    {asset.name}
                                </Typography>
                            </Box>
                            <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Button
                                    variant={asset.status === 'on' ? 'contained' : 'outlined'}
                                    onClick={() => handleStatusChange(asset.id, 'on')}
                                >
                                    On
                                </Button>
                                <Button
                                    variant={asset.status === 'off' ? 'contained' : 'outlined'}
                                    onClick={() => handleStatusChange(asset.id, 'off')}
                                >
                                    Off
                                </Button>
                                <Button
                                    variant={asset.status === 'blur' ? 'contained' : 'outlined'}
                                    onClick={() => handleStatusChange(asset.id, 'blur')}
                                >
                                    Blur
                                </Button>
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
