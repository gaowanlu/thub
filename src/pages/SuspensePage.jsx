import React from "react";
import styled from "styled-components";

export default function SuspensePage() {
    return (
        <Container>
            <div>加载中</div>
        </Container>
    );
}

const Container = styled.div`
  box-sizing: border-box;
  width: 100vw;
  height: 100vh;
  padding: 1rem;
  display: flex;
  position: fixed;
  justify-content: center;
  align-items: center;
  z-index: 9998;
  top: 0;
  background-color: var(--color-background);
`;
