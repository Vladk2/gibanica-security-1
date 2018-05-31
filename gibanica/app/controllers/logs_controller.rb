class LogsController < ApplicationController
  before_action :accept_json_only, only: [:index]
  before_action :content_type_json_only, only: [:create]
  before_action :set_log, only: [:show]

  # GET /logs
  def index
    logs = if params[:filterBy].nil?
             page = params[:page].nil? ? 1 : params[:page]
             {
               data: Log.page(page),
               count: Log.count,
               page: page
             }
           else
            # add pagination for query. first finish query lang
             Log.search(
                    params[:filterBy],
                    params[:searchBy],
                    page,
                    params[:page_size]
                )
           end

    render json: logs,
           status: !logs.nil? ? :ok : :not_found,
           except: %w[_id]
  end

  # GET /logs/monthly_status
  def monthly_status
    render json: Log.last_month, status: :ok
  end

  # POST /logs
  def create
    Log.batch_save!(log_params)

    head :ok
  end

  private

    def accept_json_only
      head :not_acceptable unless request.headers['Accept'] == 'application/json'
    end

    def content_type_json_only
      head :not_acceptable unless request.headers['Content-Type'] == 'application/json'
    end

    # Use callbacks to share common setup or constraints between actions.
    def set_log
      @log = Log.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def log_params
      # check for agents sending logs. based on agent, allow different params
      case params[:agent]
      when 'vladk'
        params.permit(logs: [:logged_time, :host, :process, :severity,
                              {
                                message: %i[port isOpen]
                              }
                            ]).require(:logs)
      when 'miko'
        params.permit(logs: [:logged_time, :host, :process, :severity,
                              {
                                message: %i[name user time is_dir dir_path action]
                              }
                            ]).require(:logs)
      when 'dragan'
        params.permit(logs: [:host, :logged_time, :process, :severity,
                              {
                                message: %i[username method]
                              }
                            ]).require(:logs)
      when 'stanija'
        params.permit(logs: [:host, :logged_time, :process, :severity,
                              {
                                message: %i[frequency temperature memory swap]
                              }
                            ]).require(:logs)
      when 'pacman'
        params.permit(logs: [:host, :logged_time, :process, :severity,
                              {
                                message: %i[content]
                              }
                            ]).require(:logs)
      else
        puts 'Agent not recognized'
      end
    end
end
