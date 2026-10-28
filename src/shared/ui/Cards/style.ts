import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Card = styled(motion.div)<{ $gradient?: string }>`

  padding: 1.5rem;
  border-radius: 1rem;
  max-width: 20%;
  max-height: 100px;
  width: 100%;
  background: ${({ $gradient }) =>
    $gradient || 'rgba(255, 255, 255, 0.05)'};
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Title = styled.p`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
`;

export const Value = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
`;

export const Change = styled.p`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: #34d399; 
`;