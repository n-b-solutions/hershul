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
import { socket } from '../../../socket';

interface AssetCollection {
    nameRoom: string;
    status: 'on' | 'off' | 'blur';
}

const API_BASE_URL = import.meta.env.VITE_LOCAL_SERVER;

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

        socket.on('roomStatusUpdated', (updatedStatuses: AssetCollection[]) => {
            console.log("socket on:",updatedStatuses);
            
            setAssetsState(updatedStatuses);

        });
        return () => {
            socket.off('roomStatusUpdated');
        };
    }, [socket]);

    const handleStatusChange = (nameRoom: string, newStatus: 'on' | 'off' | 'blur') => {
        setAssetsState((prevState) =>
            prevState.map((room) =>
                room.nameRoom === nameRoom
                    ? { ...room, status: newStatus }
                    : room
            )
        );

        // Emit an event to the server on button click
        socket.emit('changeRoomStatus', { nameRoom, newStatus });
    };

    return (
        <Box sx={{ height: '90vh', display: 'flex', flexDirection: 'column', p: 4 }}>
            <Grid container spacing={3} sx={{ flex: 1, overflow: 'auto' }}>
                {assetsState.map((room) => (
                    <Grid key={room.nameRoom} xs={12} sm={12} md={6} lg={6}>
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
                                    {room.nameRoom}
                                </Typography>
                            </Box>
                            <CardContent sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                                <Button
                                    variant={room.status === 'on' ? 'contained' : 'outlined'}
                                    sx={{ margin: '5px' }}
                                    onClick={() => handleStatusChange(room.nameRoom, 'on')}
                                >
                                    ON
                                </Button>
                                <Button
                                    variant={room.status === 'off' ? 'contained' : 'outlined'}
                                    sx={{ margin: '5px' }}
                                    onClick={() => handleStatusChange(room.nameRoom, 'off')}
                                >
                                    OFF
                                </Button>
                                <Button
                                    variant={room.status === 'blur' ? 'contained' : 'outlined'}
                                    sx={{ margin: '5px' }}
                                    onClick={() => handleStatusChange(room.nameRoom, 'blur')}
                                >
                                    BLUR
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
