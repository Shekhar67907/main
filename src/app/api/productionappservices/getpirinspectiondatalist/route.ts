import { NextResponse } from "next/server";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://10.10.1.7:8304";

export async function POST(request: Request) {
  try {
    // Parse URL parameters
    const url = new URL(request.url);
    const fromDate = url.searchParams.get('FromDate');
    const toDate = url.searchParams.get('ToDate');
    const materialCode = url.searchParams.get('MaterialCode');
    const operationCode = url.searchParams.get('OperationCode');
    const gaugeCode = url.searchParams.get('GuageCode');
    const shiftId = url.searchParams.get('ShiftId');

    // Validate required parameters
    if (!fromDate || !toDate || !materialCode || !operationCode || !gaugeCode) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Make real API call to external service
    const apiUrl = `${BASE_URL}/api/productionappservices/getpirinspectiondatalist`;
    console.log(`Making request to: ${apiUrl} with params:`, {
      FromDate: fromDate,
      ToDate: toDate,
      MaterialCode: materialCode,
      OperationCode: operationCode,
      GuageCode: gaugeCode,
      ShiftId: shiftId
    });

    const response = await axios.get(apiUrl, {
      params: {
        FromDate: fromDate,
        ToDate: toDate,
        MaterialCode: materialCode,
        OperationCode: operationCode,
        GuageCode: gaugeCode,
        ShiftId: shiftId
      },
      timeout: 15000 // 15 second timeout
    });

    // Return the actual API response
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error("Error fetching inspection data:", error);
    
    // Handle specific error cases
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        return NextResponse.json(
          { error: `API Error: ${error.response.data?.message || error.message}` },
          { status: error.response.status }
        );
      } else if (error.request) {
        // The request was made but no response was received
        return NextResponse.json(
          { error: "No response received from API. The server may be down or unreachable." },
          { status: 503 }
        );
      } else if (error.code === 'ECONNABORTED') {
        // Timeout error
        return NextResponse.json(
          { error: "Request timed out. The API server may be overloaded." },
          { status: 504 }
        );
      }
    }
    
    // Generic error response
    return NextResponse.json(
      { error: "Failed to fetch inspection data" },
      { status: 500 }
    );
  }
}