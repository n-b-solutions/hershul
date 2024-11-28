import { useState } from 'react';
import { selectPopupState } from '@/redux/message/messageSlice';
import { closePopup } from '@/redux/message/messageThunk';
import { AppDispatch } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';

import { GenericDialog } from '../core/generic-dialog';
import { CreateMessagePopup } from './CreateMessagePopup';
import { MessagesPopup } from './MessagesPopup';
import RepeatAnnounce from './RepeatAnnounce';

interface ManagingStepsProps {
  room?: string;
}

export const ManagingSteps: React.FC<ManagingStepsProps> = () => {
  const popupState = useSelector(selectPopupState);

  const [step, setStep] = useState<number>(1);
  const dispatch = useDispatch<AppDispatch>();

  const handleClose = (messageId?: string) => {
    dispatch(closePopup(messageId));
    setStep(1);
  };

  const onStepFinish = (messageId?: string): void => {
    if (step === 1) {
      {
        messageId ? (popupState.field === 'blink' ? setStep(3) : handleClose(messageId)) : setStep(2);
      }
    }
    if (step === 2) {
      if (popupState.field === 'blink') {
        setStep(3);
      } else {
        handleClose(messageId);
      }
    }
    if (step === 3) {
      handleClose(messageId);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <MessagesPopup onFinish={(messageId?: string) => onStepFinish(messageId)} />;
        break;
      case 2:
        return <CreateMessagePopup room={popupState.roomName} onFinish={onStepFinish} />;
        break;
      case 3:
        return <RepeatAnnounce onFinish={onStepFinish} />;
        break;
      default:
        return <MessagesPopup onFinish={(messageId?: string) => onStepFinish(messageId)} />;
        break;
    }
  };

  return (
    <GenericDialog open={popupState.open} handleClose={() => handleClose()}>
      {renderStep()}
    </GenericDialog>
  );
};

export default ManagingSteps;
